import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../App.css";

export default function TeacherDashboard() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formSlot, setFormSlot] = useState({ time: "", duration: 30, topic: "" });
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (!token) console.log("No access token found! Please login first.");
  else axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.log("Error fetching slots:", err.response || err);
      setMessage("Failed to fetch slots.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  const handleChange = (e) => setFormSlot({ ...formSlot, [e.target.name]: e.target.value });

  const computeEndTime = (start, duration) => {
    const [hours, minutes] = start.split(":").map(Number);
    const end = new Date();
    end.setHours(hours);
    end.setMinutes(minutes + Number(duration));
    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formSlot.time) return setMessage("Please select a time.");

    const payload = {
      date: selectedDate.toISOString().split("T")[0],
      start_time: formSlot.time,
      end_time: computeEndTime(formSlot.time, formSlot.duration),
      topic: formSlot.topic,
    };

    try {
      if (editingSlotId) {
        await axios.patch(`http://127.0.0.1:8000/api/teacher/slots/${editingSlotId}/`, payload);
        setMessage("Slot updated successfully!");
      } else {
        await axios.post("http://127.0.0.1:8000/api/teacher/slots/", payload);
        setMessage("Slot added successfully!");
      }
      fetchSlots();
      setFormSlot({ time: "", duration: 30, topic: "" });
      setEditingSlotId(null);
    } catch (err) {
      console.log("Error saving slot:", err.response || err);
      setMessage("Failed to save slot.");
    }
  };

  const handleEdit = (slot) => {
    setSelectedDate(new Date(slot.date));
    setFormSlot({ time: slot.start_time, duration: 30, topic: slot.topic || "" });
    setEditingSlotId(slot.id);
    setMessage("");
  };

  const handleDelete = async (slot) => {
    if (slot.is_booked && !window.confirm("This slot is booked. Delete anyway?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teacher/slots/${slot.id}/`);
      setMessage("Slot deleted successfully!");
      fetchSlots();
    } catch (err) {
      console.log("Error deleting slot:", err.response || err);
      setMessage("Failed to delete slot.");
    }
  };

  const slotsForSelectedDate = slots.filter(slot => slot.date === selectedDate.toISOString().split("T")[0]);

  return (
    <div className="dashboard-page">
      <h2>Teacher Dashboard</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div className="calendar-container">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          tileClassName={({ date }) => 
            slots.some(slot => slot.date === date.toISOString().split("T")[0]) ? "has-slot" : null
          }
        />
      </div>

      <form className="form-box" onSubmit={handleSubmit}>
        <h3>{editingSlotId ? "Edit Slot" : `Add Slot for ${selectedDate.toDateString()}`}</h3>
        <input type="time" name="time" value={formSlot.time} onChange={handleChange} required />
        <input type="number" name="duration" value={formSlot.duration} onChange={handleChange} min="15" max="120" />
        <input type="text" name="topic" value={formSlot.topic} onChange={handleChange} placeholder="Topic (optional)" />
        <button type="submit">{editingSlotId ? "Update Slot" : "Add Slot"}</button>
        {editingSlotId && <button type="button" onClick={() => { setEditingSlotId(null); setFormSlot({ time: "", duration: 30, topic: "" }); }}>Cancel</button>}
      </form>

      <h3>Slots for {selectedDate.toDateString()}</h3>
      {slotsForSelectedDate.length === 0 ? (
        <p>No slots on this date.</p>
      ) : (
        <table className="slot-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slotsForSelectedDate.map(slot => (
              <tr key={slot.id}>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>{slot.topic || "N/A"}</td>
                <td>{slot.is_booked ? "Booked" : "Available"}</td>
                <td>
                  <button onClick={() => handleEdit(slot)}>Edit</button>
                  <button onClick={() => handleDelete(slot)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
