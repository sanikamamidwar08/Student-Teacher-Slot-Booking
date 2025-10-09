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
        // Backend already sends student_name, date, start_time etc.
        const mappedBookings = res.data.map((b) => ({
          id: b.id,
          student_name: b.student_name,     // ✅ direct from serializer
          date: b.date,                     // ✅ direct
          start_time: b.start_time,         // ✅ direct
          end_time: b.end_time,             // ✅ direct
          topic: b.topic,                   // ✅ direct
          status: b.status,                 // ✅ direct
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
    <div className="view-bookings-page">
      <h3>View Bookings</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="slot-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.student_name}</td>
                <td>{booking.date}</td>
                <td>{booking.start_time}</td>
                <td>{booking.end_time}</td>
                <td>{booking.topic}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
