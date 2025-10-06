// src/pages/teacher/TeacherDashboard.jsx
import { useState, useEffect } from "react";
import ViewSchedule from "./ViewSchedule";
import UpdateSchedule from "./UpdateSchedule";
import ChangeSchedule from "./ChangeSchedule";
import ViewBookings from "./ViewBookings";
import Notifications from "./Notifications";
import "../../App.css";
import axios from "axios";

export default function TeacherDashboard() {
  const [activePage, setActivePage] = useState("view");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!token) setMessage("⚠️ No access token found. Please login.");
  }, [token]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>Teacher Dashboard</h2>
        <ul>
          <li
            className={activePage === "view" ? "active" : ""}
            onClick={() => setActivePage("view")}
          >
            📅 View Schedule
          </li>
          <li
            className={activePage === "update" ? "active" : ""}
            onClick={() => setActivePage("update")}
          >
            ➕ Update Schedule
          </li>
          <li
            className={activePage === "change" ? "active" : ""}
            onClick={() => setActivePage("change")}
          >
            ✏️ Change Schedule
          </li>
          <li
            className={activePage === "bookings" ? "active" : ""}
            onClick={() => setActivePage("bookings")}
          >
            📖 View Bookings
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

        {activePage === "view" && <ViewSchedule />}
        {activePage === "update" && <UpdateSchedule />}
        {activePage === "change" && <ChangeSchedule />}
        {activePage === "bookings" && <ViewBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
