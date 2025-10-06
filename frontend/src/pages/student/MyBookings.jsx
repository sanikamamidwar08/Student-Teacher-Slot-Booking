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
      console.log(err);
      setMessage("Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    if (token) fetchMyBookings();
  }, [token]);

  return (
    <div className="my-bookings-page">
      <h3>My Bookings</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="slot-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.teacher_name}</td>
                <td>{b.date}</td>
                <td>{b.start_time}</td>
                <td>{b.end_time}</td>
                <td>{b.topic || "N/A"}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
