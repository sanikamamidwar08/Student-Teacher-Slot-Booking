import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function TeacherDashboard() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", duration: 30, topic: "" });

  const token = localStorage.getItem("access_token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.log("Error fetching slots:", err.response || err);
    }
  };

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const [hours, minutes] = newSlot.time.split(":").map(Number);
      const end = new Date();
      end.setHours(hours);
      end.setMinutes(minutes + Number(newSlot.duration));

      const payload = {
        date: newSlot.date,
        start_time: newSlot.time,
        end_time: `${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`,
        topic: newSlot.topic,
      };

      await axios.post("http://127.0.0.1:8000/api/teacher/slots/", payload);
      fetchSlots();
      setNewSlot({ date: "", time: "", duration: 30, topic: "" });
    } catch (err) {
      console.log("Error adding slot:", err.response || err);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

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
        {slots.length === 0 ? <p>No slots available.</p> : slots.map((slot) => (
          <div className="slot-item" key={slot.id}>
            <p>Date: {slot.date}</p>
            <p>Start: {slot.start_time}</p>
            <p>End: {slot.end_time}</p>
            <p>Topic: {slot.topic || "N/A"}</p>
            <p>Status: {slot.is_booked ? "Booked" : "Available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
