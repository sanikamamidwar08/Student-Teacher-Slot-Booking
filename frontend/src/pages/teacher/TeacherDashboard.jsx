// src/pages/teacher/TeacherDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Collapsible sidebar
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      setMessage("⚠️ No access token found. Please login.");
      navigate("/login");
    } else if (role !== "teacher") {
      setMessage("⚠️ Unauthorized! Only teachers can access this page.");
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token, role, navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>👩‍🏫 Teacher Dashboard</h2>
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
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
        {message && <p className="error-message">{message}</p>}
        {activePage === "view" && <ViewSchedule />}
        {activePage === "update" && <UpdateSchedule />}
        {activePage === "change" && <ChangeSchedule />}
        {activePage === "bookings" && <ViewBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
