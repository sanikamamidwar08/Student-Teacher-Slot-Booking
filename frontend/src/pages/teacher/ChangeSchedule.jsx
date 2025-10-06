import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function ChangeSchedule() {
  const [slots, setSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Fetch all slots
  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch slots.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  const handleChange = (e) => {
    setEditingSlot({ ...editingSlot, [e.target.name]: e.target.value });
  };

  const computeEndTime = (start, duration) => {
    const [hours, minutes] = start.split(":").map(Number);
    const end = new Date();
    end.setHours(hours);
    end.setMinutes(minutes + Number(duration));
    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    const payload = {
      date: editingSlot.date,
      start_time: editingSlot.start_time,
      end_time: computeEndTime(editingSlot.start_time, editingSlot.duration),
      topic: editingSlot.topic,
    };

    try {
      await axios.patch(`http://127.0.0.1:8000/api/teacher/slots/${editingSlot.id}/`, payload);
      setMessage("Slot updated successfully!");
      setEditingSlot(null);
      fetchSlots();
    } catch (err) {
      console.log(err);
      setMessage("Failed to update slot.");
    }
  };

  const handleDelete = async (slot) => {
    if (slot.is_booked && !window.confirm("This slot is booked. Delete anyway?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teacher/slots/${slot.id}/`);
      setMessage("Slot deleted successfully!");
      fetchSlots();
    } catch (err) {
      console.log(err);
      setMessage("Failed to delete slot.");
    }
  };

  return (
    <div className="change-schedule-page">
      <h3>Change Schedule</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <table className="slot-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Topic</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot.id}>
              <td>{slot.date}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>{slot.topic || "N/A"}</td>
              <td>{slot.is_booked ? "Booked" : "Available"}</td>
              <td>
                <button onClick={() => setEditingSlot(slot)}>Edit</button>
                <button onClick={() => handleDelete(slot)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSlot && (
        <form className="form-box" onSubmit={handleUpdate}>
          <h4>Edit Slot: {editingSlot.date}</h4>
          <label>Date:</label>
          <input type="date" name="date" value={editingSlot.date} onChange={handleChange} required />

          <label>Start Time:</label>
          <input type="time" name="start_time" value={editingSlot.start_time} onChange={handleChange} required />

          <label>Duration (minutes):</label>
          <input type="number" name="duration" value={editingSlot.duration} onChange={handleChange} min="30" max="60" required />

          <label>Topic (optional):</label>
          <input type="text" name="topic" value={editingSlot.topic} onChange={handleChange} placeholder="Topic" />

          <button type="submit">Update Slot</button>
          <button type="button" onClick={() => setEditingSlot(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
