// src/pages/student/MyBookings.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/student/bookings/");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    if (token) fetchMyBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/student/bookings/${bookingId}/`);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      setMessage("✅ Booking canceled successfully.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to cancel booking.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {message && (
        <p
          className={`mb-4 font-medium ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Teacher</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Start</th>
                <th className="px-4 py-2 border-b">End</th>
                <th className="px-4 py-2 border-b">Topic</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{b.teacher_name}</td>
                  <td className="px-4 py-2 border-b">{b.date}</td>
                  <td className="px-4 py-2 border-b">{b.start_time}</td>
                  <td className="px-4 py-2 border-b">{b.end_time}</td>
                  <td className="px-4 py-2 border-b">{b.topic || "N/A"}</td>
                  <td className="px-4 py-2 border-b text-green-600">{b.status}</td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
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
