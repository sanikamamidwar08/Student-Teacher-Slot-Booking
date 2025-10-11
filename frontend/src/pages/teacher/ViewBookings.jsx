// src/pages/teacher/ViewBookings.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("⚠️ You are not logged in.");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/teacher/bookings/");
        const mappedBookings = res.data.map((b) => ({
          id: b.id,
          student_name: b.student_name,
          date: b.date,
          start_time: b.start_time,
          end_time: b.end_time,
          topic: b.topic,
          status: b.status,
        }));
        setBookings(mappedBookings);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) setMessage("Unauthorized! Please login again.");
        else setMessage("Failed to fetch bookings.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📖 View Bookings</h2>

      {message && (
        <p className={`mb-4 font-medium ${message.includes("⚠️") || message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-3 text-left">Student Name</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Start</th>
                <th className="py-2 px-3 text-left">End</th>
                <th className="py-2 px-3 text-left">Topic</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{booking.student_name}</td>
                  <td className="py-2 px-3">{booking.date}</td>
                  <td className="py-2 px-3">{booking.start_time}</td>
                  <td className="py-2 px-3">{booking.end_time}</td>
                  <td className="py-2 px-3">{booking.topic || "N/A"}</td>
                  <td className="py-2 px-3">
                    {booking.status === "booked"
                      ? "📌 Booked"
                      : booking.status === "completed"
                      ? "✅ Completed"
                      : "❌ Cancelled"}
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
