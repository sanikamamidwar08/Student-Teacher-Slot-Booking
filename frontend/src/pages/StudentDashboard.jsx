import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("access_token");

  const fetchAvailableSlots = async () => {
    try {
      const res = await axios.get("/api/available-slots/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/my-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBook = async (slotId) => {
    try {
      await axios.post(
        "/api/bookings/",
        { slot: slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAvailableSlots();
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
    fetchBookings();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Student Dashboard</h2>

      <h3>Available Slots</h3>
      <div className="slot-list">
        {slots.length === 0 ? (
          <p>No available slots.</p>
        ) : (
          slots.map((slot) => (
            <div className="slot-item" key={slot.id}>
              <p>Teacher: {slot.teacher_username}</p>
              <p>Date: {slot.date}</p>
              <p>Time: {slot.time}</p>
              <p>Duration: {slot.duration} mins</p>
              <p>Topic: {slot.topic || "N/A"}</p>
              <button onClick={() => handleBook(slot.id)}>Book</button>
            </div>
          ))
        )}
      </div>

      <h3>My Bookings</h3>
      <div className="slot-list">
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div className="slot-item" key={booking.id}>
              <p>Teacher: {booking.slot.teacher_username}</p>
              <p>Date: {booking.slot.date}</p>
              <p>Time: {booking.slot.time}</p>
              <p>Duration: {booking.slot.duration} mins</p>
              <p>Topic: {booking.slot.topic || "N/A"}</p>
              <p>Status: {booking.slot.is_booked ? "Booked" : "Available"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
