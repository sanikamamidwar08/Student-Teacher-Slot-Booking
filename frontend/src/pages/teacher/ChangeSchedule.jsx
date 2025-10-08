// src/pages/teacher/ChangeSchedule.jsx
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
      setMessage("❌ Failed to fetch slots.");
    }
  };

  useEffect(() => {
    if (token) fetchSlots();
  }, [token]);

  const handleChange = (e) => {
    setEditingSlot({ ...editingSlot, [e.target.name]: e.target.value });
  };

  // Compute end_time from start_time + duration
  const computeEndTime = (start, duration) => {
    const [hours, minutes] = start.split(":").map(Number);
    const end = new Date();
    end.setHours(hours);
    end.setMinutes(minutes + Number(duration));
    return `${String(end.getHours()).padStart(2, "0")}:${String(
      end.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Update slot
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
      await axios.patch(
        `http://127.0.0.1:8000/api/teacher/slots/${editingSlot.id}/`,
        payload
      );

      // If slot was booked → send notification
      if (editingSlot.is_booked) {
        await axios.post("http://127.0.0.1:8000/api/teacher/notify-student/", {
          slot_id: editingSlot.id,
          message: "Your booked slot has been updated by the teacher.",
        });
      }

      setMessage("✅ Slot updated successfully!");
      setEditingSlot(null);
      fetchSlots();
    } catch (err) {
      console.log(err);
      setMessage("❌ Failed to update slot.");
    }
  };

  // Delete slot
  const handleDelete = async (slot) => {
    if (
      slot.is_booked &&
      !window.confirm(
        "⚠️ This slot is booked. Do you want to delete it? Student will be notified."
      )
    )
      return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/teacher/slots/${slot.id}/`
      );

      // Notify student if booked
      if (slot.is_booked) {
        await axios.post("http://127.0.0.1:8000/api/teacher/notify-student/", {
          slot_id: slot.id,
          message: "Your booked slot has been cancelled by the teacher.",
        });
      }

      setMessage("✅ Slot deleted successfully!");
      fetchSlots();
    } catch (err) {
      console.log(err);
      setMessage("❌ Failed to delete slot.");
    }
  };

  return (
    <div className="change-schedule-page">
      <h3>Change Schedule</h3>
      {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

      {/* Slots Table */}
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
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.date}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>{slot.topic || "N/A"}</td>
              <td>{slot.is_booked ? "📌 Booked" : "✅ Available"}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => setEditingSlot(slot)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(slot)}
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingSlot && (
        <form className="form-box edit-form" onSubmit={handleUpdate}>
          <h4>Edit Slot: {editingSlot.date}</h4>

          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={editingSlot.date}
            onChange={handleChange}
            required
          />

          <label>Start Time:</label>
          <input
            type="time"
            name="start_time"
            value={editingSlot.start_time}
            onChange={handleChange}
            required
          />

          <label>Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            value={editingSlot.duration || 30}
            onChange={handleChange}
            min="30"
            max="60"
            required
          />

          <label>Topic (optional):</label>
          <input
            type="text"
            name="topic"
            value={editingSlot.topic}
            onChange={handleChange}
            placeholder="Topic"
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              💾 Update Slot
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditingSlot(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
