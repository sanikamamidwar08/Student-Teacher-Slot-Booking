import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function TeacherDashboard() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", duration: 30, topic: "" });

  const token = localStorage.getItem("access_token");

  const fetchSlots = async () => {
    try {
      const res = await axios.get("/api/slots/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/slots/", newSlot, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
      setNewSlot({ date: "", time: "", duration: 30, topic: "" });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Teacher Dashboard</h2>

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
              <p>Time: {slot.time}</p>
              <p>Duration: {slot.duration} mins</p>
              <p>Topic: {slot.topic || "N/A"}</p>
              <p>Status: {slot.is_booked ? "Booked" : "Available"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
