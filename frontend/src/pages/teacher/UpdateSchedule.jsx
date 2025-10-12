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
      setMessage(
        err.response?.status === 401
          ? "❌ Unauthorized. Please login."
          : "❌ Failed to add slot."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">➕ Update Schedule</h2>

      {message && (
        <p
          className={`mb-4 font-medium ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Add Slot Form */}
      <form
        className="bg-gray-50 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="date"
          name="date"
          value={formSlot.date}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="time"
          name="start_time"
          value={formSlot.start_time}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="duration"
          value={formSlot.duration}
          onChange={handleChange}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
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
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            name="is_available"
            checked={formSlot.is_available}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Mark as Available
        </label>
        <button
          type="submit"
          className="md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          ➕ Add Slot
        </button>
      </form>

      {/* Existing Slots */}
      <h3 className="text-xl font-semibold mb-2">📅 Existing Slots</h3>
      {slots.length === 0 ? (
        <p className="text-gray-600">No slots added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Start</th>
                <th className="py-2 px-3 text-left">End</th>
                <th className="py-2 px-3 text-left">Duration</th>
                <th className="py-2 px-3 text-left">Topic</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{slot.date}</td>
                  <td className="py-2 px-3">{slot.start_time}</td>
                  <td className="py-2 px-3">{slot.end_time}</td>
                  <td className="py-2 px-3">{slot.duration || "N/A"} min</td>
                  <td className="py-2 px-3">{slot.topic || "N/A"}</td>
                  <td className="py-2 px-3">
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
      )}
    </div>
  );
}
