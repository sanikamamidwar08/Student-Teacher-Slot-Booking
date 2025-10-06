import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function TeacherDashboard() {
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    const res = await axios.get("/api/teacher/slots/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    });
    setSlots(res.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h2>My Slots</h2>
        <div className="slots">
          {slots.map((slot) => (
            <div key={slot.id} className="slot-card">
              <p>Date: {slot.date}</p>
              <p>Time: {slot.start_time} - {slot.end_time}</p>
              <p>Topic: {slot.topic || "N/A"}</p>
              <p>Status: {slot.is_booked ? "Booked" : "Available"}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
