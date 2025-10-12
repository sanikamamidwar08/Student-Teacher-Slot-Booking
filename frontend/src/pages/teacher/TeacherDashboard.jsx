// src/pages/teacher/TeacherDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewSchedule from "./ViewSchedule";
import UpdateSchedule from "./UpdateSchedule";
import ChangeSchedule from "./ChangeSchedule";
import ViewBookings from "./ViewBookings";
import Notifications from "./Notifications";
import axios from "axios";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const [activePage, setActivePage] = useState("view");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const menuItems = [
    { id: "view", icon: "📅", label: "View Schedule" },
    { id: "update", icon: "➕", label: "Update Schedule" },
    { id: "change", icon: "✏️", label: "Change Schedule" },
    { id: "bookings", icon: "📖", label: "View Bookings" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className={`${sidebarOpen ? "block" : "hidden"}`}>👩‍🏫 Teacher</h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {message && <p className="message-box">{message}</p>}

        {activePage === "view" && <ViewSchedule />}
        {activePage === "update" && <UpdateSchedule />}
        {activePage === "change" && <ChangeSchedule />}
        {activePage === "bookings" && <ViewBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
