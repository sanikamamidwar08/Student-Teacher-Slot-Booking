// src/pages/teacher/UpdateSchedule.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function UpdateSchedule() {
  const [slots, setSlots] = useState([]);
  const [formSlot, setFormSlot] = useState({
    date: "",
    start_time: "",
    duration: "30",
    topic: "",
    is_available: true,
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/");
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch slots.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormSlot({ ...formSlot, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [hours, minutes] = formSlot.start_time.split(":").map(Number);
    const duration = Number(formSlot.duration);
    const endDate = new Date();
    endDate.setHours(hours);
    endDate.setMinutes(minutes + duration);
    const end_time = `${String(endDate.getHours()).padStart(2, "0")}:${String(
      endDate.getMinutes()
    ).padStart(2, "0")}`;

    const payload = {
      date: formSlot.date,
      start_time: formSlot.start_time,
      end_time,
      topic: formSlot.topic,
      is_available: formSlot.is_available,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/teacher/slots/", payload);
      setMessage("✅ Slot added successfully!");
      setFormSlot({
        date: "",
        start_time: "",
        duration: "30",
        topic: "",
        is_available: true,
      });
      fetchSlots();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setMessage("❌ Unauthorized. Please login.");
      else setMessage("❌ Failed to add slot.");
    }
  };

  return (
    <div className="update-schedule-page">
      <h3>Update Schedule</h3>
      {message && (
        <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>
      )}

      {/* Add Slot Form */}
      <form className="form-box update-form" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formSlot.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="start_time"
          value={formSlot.start_time}
          onChange={handleChange}
          required
        />

        <select name="duration" value={formSlot.duration} onChange={handleChange}>
          <option value="30">30 Minutes</option>
          <option value="45">45 Minutes</option>
          <option value="60">60 Minutes</option>
        </select>

        <input
          type="text"
          name="topic"
          value={formSlot.topic}
          onChange={handleChange}
          placeholder="Topic (optional)"
        />

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="is_available"
            checked={formSlot.is_available}
            onChange={handleChange}
          />
          Mark as Available
        </label>

        <button type="submit">➕ Add Slot</button>
      </form>

      {/* Existing Slots */}
      <h4>Existing Slots</h4>
      <table className="slot-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Topic</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.date}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>{slot.duration || "N/A"} min</td>
              <td>{slot.topic || "N/A"}</td>
              <td>
                {slot.is_booked
                  ? "📚 Booked by Student"
                  : slot.is_available
                  ? "✅ Available"
                  : "❌ Unavailable"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
