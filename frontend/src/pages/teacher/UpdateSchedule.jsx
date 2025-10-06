// src/pages/teacher/UpdateSchedule.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function UpdateSchedule() {
  const [slots, setSlots] = useState([]);
  const [formSlot, setFormSlot] = useState({ date: "", start_time: "", end_time: "", topic: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch slots.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  const handleChange = (e) => setFormSlot({ ...formSlot, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/teacher/slots/", formSlot);
      setMessage("Slot added successfully!");
      setFormSlot({ date: "", start_time: "", end_time: "", topic: "" });
      fetchSlots();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setMessage("Unauthorized. Please login.");
      else setMessage("Failed to add slot.");
    }
  };

  return (
    <div className="update-schedule-page">
      <h3>Update Schedule</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form className="form-box" onSubmit={handleSubmit}>
        <input type="date" name="date" value={formSlot.date} onChange={handleChange} required />
        <input type="time" name="start_time" value={formSlot.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" value={formSlot.end_time} onChange={handleChange} required />
        <input type="text" name="topic" value={formSlot.topic} onChange={handleChange} placeholder="Topic (optional)" />
        <button type="submit">Add Slot</button>
      </form>

      <h4>Existing Slots</h4>
      <table className="slot-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot.id}>
              <td>{slot.date}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>{slot.topic || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
