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
    <div className="my-bookings-page">
      <h3>My Bookings</h3>
      {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="slot-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.teacher_name}</td>
                <td>{b.date}</td>
                <td>{b.start_time}</td>
                <td>{b.end_time}</td>
                <td>{b.topic || "N/A"}</td>
                <td style={{ color: "green" }}>{b.status}</td>
                <td>
                  <button onClick={() => handleCancel(b.id)}>Cancel</button>
                  {/* Optionally: Reschedule */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
