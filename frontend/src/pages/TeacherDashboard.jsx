import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function TeacherDashboard() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", duration: 30, topic: "" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  if (!token) console.log("No access token found! Please login first.");
  else axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Fetch teacher slots
  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.log("Error fetching slots:", err.response || err);
      setError("Failed to fetch slots. Check login/token.");
    }
  };

  // Input change handler
  const handleChange = (e) => setNewSlot({ ...newSlot, [e.target.name]: e.target.value });

  // Add new slot
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Compute end_time based on duration
      const [hours, minutes] = newSlot.time.split(":").map(Number);
      const end = new Date();
      end.setHours(hours);
      end.setMinutes(minutes + Number(newSlot.duration));

      const payload = {
        date: newSlot.date,
        start_time: newSlot.time,
        end_time: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
        topic: newSlot.topic,
      };

      await axios.post("http://127.0.0.1:8000/api/teacher/slots/", payload);
      fetchSlots();
      setNewSlot({ date: "", time: "", duration: 30, topic: "" });
    } catch (err) {
      console.log("Error adding slot:", err.response || err);
      setError("Failed to add slot. Check payload or token.");
    }
  };

  // Delete slot
  const handleDeleteSlot = async (id) => {
    setError("");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teacher/slots/${id}/`);
      fetchSlots();
    } catch (err) {
      console.log("Error deleting slot:", err.response || err);
      setError("Failed to delete slot.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  return (
    <div className="dashboard-page">
      <h2>Teacher Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="form-box" onSubmit={handleAddSlot}>
        <h3>Add New Slot</h3>
        <input type="date" name="date" value={newSlot.date} onChange={handleChange} required />
        <input type="time" name="time" value={newSlot.time} onChange={handleChange} required />
        <input type="number" name="duration" value={newSlot.duration} onChange={handleChange} min="15" max="120" />
        <input type="text" name="topic" value={newSlot.topic} onChange={handleChange} placeholder="Topic (optional)" />
        <button type="submit">Add Slot</button>
      </form>

      <h3>My Slots</h3>
      <div className="slot-list">
        {slots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          slots.map((slot) => (
            <div className="slot-item" key={slot.id}>
              <p>Date: {slot.date}</p>
              <p>Start: {slot.start_time}</p>
              <p>End: {slot.end_time}</p>
              <p>Topic: {slot.topic || "N/A"}</p>
              <p>Status: {slot.is_booked ? "Booked" : "Available"}</p>
              <button onClick={() => handleDeleteSlot(slot.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
