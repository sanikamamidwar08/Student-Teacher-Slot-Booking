import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function StudentDashboard() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchAvailableSlots = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/student/slots/");
      setAvailableSlots(res.data);
    } catch (err) {
      console.log("Error fetching available slots:", err.response || err);
      setError("Failed to fetch available slots. Check login/token.");
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/student/bookings/");
      setMyBookings(res.data);
    } catch (err) {
      console.log("Error fetching my bookings:", err.response || err);
      setError("Failed to fetch your bookings. Check login/token.");
    }
  };

  const handleBookSlot = async (slotId) => {
    setError("");
    if (!slotId) return setError("Invalid slot selected.");
    try {
      await axios.post("http://127.0.0.1:8000/api/student/book/", { slot: slotId, purpose: "Study session" });
      fetchAvailableSlots();
      fetchMyBookings();
    } catch (err) {
      console.log("Error booking slot:", err.response || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to book slot. Check payload or token.");
    }
  };

  useEffect(() => { if (token) { fetchAvailableSlots(); fetchMyBookings(); } }, [token]);

  return (
    <div className="dashboard-page">
      <h2>Student Dashboard</h2>
      {error && <p style={{color:"red"}}>{error}</p>}

      <h3>Available Slots</h3>
      <div className="slot-list">
        {availableSlots.length === 0 ? <p>No slots available.</p> : availableSlots.map(slot => (
          <div className="slot-item" key={slot.id}>
            <p>Teacher: {slot.teacher}</p>
            <p>Date: {slot.date}</p>
            <p>Start: {slot.start_time}</p>
            <p>End: {slot.end_time}</p>
            <p>Topic: {slot.topic || "N/A"}</p>
            <button onClick={() => handleBookSlot(slot.id)}>Book Slot</button>
          </div>
        ))}
      </div>

      <h3>My Bookings</h3>
      <div className="slot-list">
        {myBookings.length === 0 ? <p>You have no bookings yet.</p> : myBookings.map(booking => (
          <div className="slot-item" key={booking.id}>
            <p>Teacher: {booking.slot.teacher}</p>
            <p>Date: {booking.slot.date}</p>
            <p>Start: {booking.slot.start_time}</p>
            <p>End: {booking.slot.end_time}</p>
            <p>Topic: {booking.slot.topic || "N/A"}</p>
            <p>Purpose: {booking.purpose}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
