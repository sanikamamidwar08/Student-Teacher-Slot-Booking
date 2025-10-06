import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchSlots = async () => {
    const res = await axios.get("/api/student/slots/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    });
    setSlots(res.data);
  };

  const fetchBookings = async () => {
    const res = await axios.get("/api/student/bookings/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    });
    setBookings(res.data);
  };

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h2>Available Slots</h2>
        <div className="slots">
          {slots.map((slot) => (
            <div key={slot.id} className="slot-card">
              <p>Teacher: {slot.teacher}</p>
              <p>Date: {slot.date}</p>
              <p>Time: {slot.start_time} - {slot.end_time}</p>
            </div>
          ))}
        </div>

        <h2>My Bookings</h2>
        <div className="bookings">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <p>Teacher: {booking.slot.teacher}</p>
              <p>Date: {booking.slot.date}</p>
              <p>Time: {booking.slot.start_time} - {booking.slot.end_time}</p>
              <p>Purpose: {booking.purpose}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
