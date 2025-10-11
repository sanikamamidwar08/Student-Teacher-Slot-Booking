// src/pages/teacher/ViewSchedule.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function ViewSchedule() {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("⚠️ You are not logged in.");
      return;
    }

    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/teacher/slots/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mappedSlots = res.data.map((slot) => ({
          id: slot.id,
          date: new Date(slot.date).toLocaleDateString(),
          start_time: slot.start_time,
          end_time: slot.end_time,
          topic: slot.topic || "N/A",
          status: slot.is_booked ? "📌 Booked" : "✅ Available",
        }));

        setSlots(mappedSlots);
      } catch (err) {
        console.error("AxiosError", err);
        if (err.response?.status === 401) setMessage("Unauthorized! Please login again.");
        else if (err.response?.status === 404) setMessage("Slots endpoint not found.");
        else setMessage("❌ Failed to fetch slots.");
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📅 View Schedule</h2>

      {message && (
        <p className={`mb-4 font-medium ${message.includes("❌") || message.includes("⚠️") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {slots.length === 0 ? (
        <p className="text-gray-600">No slots yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Start</th>
                <th className="py-2 px-3 text-left">End</th>
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
                  <td className="py-2 px-3">{slot.topic}</td>
                  <td className="py-2 px-3">{slot.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
