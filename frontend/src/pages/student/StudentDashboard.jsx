// src/pages/student/StudentDashboard.jsx
import { useState, useEffect } from "react";
import ViewTeachers from "./ViewTeachers";
import BookSlot from "./BookSlot";
import MyBookings from "./MyBookings";
import Notifications from "./Notifications";
import "../../App.css";
import axios from "axios";

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("teachers");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!token) setMessage("⚠️ No access token found. Please login first.");
  }, [token]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>Student Dashboard</h2>
        <ul>
          <li
            className={activePage === "teachers" ? "active" : ""}
            onClick={() => setActivePage("teachers")}
          >
            👨‍🏫 View Teachers
          </li>
          <li
            className={activePage === "book" ? "active" : ""}
            onClick={() => setActivePage("book")}
          >
            📅 Book Slot
          </li>
          <li
            className={activePage === "myBookings" ? "active" : ""}
            onClick={() => setActivePage("myBookings")}
          >
            📖 My Bookings
          </li>
          <li
            className={activePage === "notifications" ? "active" : ""}
            onClick={() => setActivePage("notifications")}
          >
            🔔 Notifications
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {message && <p style={{ color: "red" }}>{message}</p>}

        {activePage === "teachers" && <ViewTeachers />}
        {activePage === "book" && <BookSlot />}
        {activePage === "myBookings" && <MyBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
