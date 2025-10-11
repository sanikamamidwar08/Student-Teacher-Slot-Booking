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

  const handleDelete = async (slot) => {
    if (slot.is_booked && !window.confirm("⚠️ This slot is booked. Student will be notified."))
      return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/teacher/slots/${slot.id}/`);

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Change Schedule</h2>
      {message && (
        <p className={`mb-4 font-medium ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Slots Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Topic</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{slot.date}</td>
                <td className="px-4 py-2">{slot.start_time}</td>
                <td className="px-4 py-2">{slot.end_time}</td>
                <td className="px-4 py-2">{slot.topic || "N/A"}</td>
                <td className="px-4 py-2">{slot.is_booked ? "📌 Booked" : "✅ Available"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    onClick={() => setEditingSlot(slot)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(slot)}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editingSlot && (
        <form className="bg-white p-4 rounded shadow-md space-y-3" onSubmit={handleUpdate}>
          <h3 className="text-lg font-semibold mb-2">Edit Slot: {editingSlot.date}</h3>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="date"
              name="date"
              value={editingSlot.date}
              onChange={handleChange}
              className="border rounded px-3 py-2 flex-1"
              required
            />
            <input
              type="time"
              name="start_time"
              value={editingSlot.start_time}
              onChange={handleChange}
              className="border rounded px-3 py-2 flex-1"
              required
            />
            <input
              type="number"
              name="duration"
              value={editingSlot.duration || 30}
              onChange={handleChange}
              min="30"
              max="60"
              className="border rounded px-3 py-2 flex-1"
              placeholder="Duration (min)"
              required
            />
          </div>

          <input
            type="text"
            name="topic"
            value={editingSlot.topic}
            onChange={handleChange}
            placeholder="Topic (optional)"
            className="border rounded px-3 py-2 w-full"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 Update Slot
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
