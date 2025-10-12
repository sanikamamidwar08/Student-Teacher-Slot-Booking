import { useState, useEffect } from "react";
import ViewTeachers from "./ViewTeachers.jsx";
import BookSlot from "./BookSlot.jsx";
import MyBookings from "./MyBookings.jsx";
import Notifications from "./Notifications.jsx";
import Footer from "../../components/Footer.jsx";
import "./StudentDashborad.css";
import axios from "axios";

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("teachers");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  const studentName = localStorage.getItem("username") || "Student";

  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!token) setMessage("⚠️ No access token found. Please login first.");
  }, [token]);

  const sidebarItems = [
    { id: "teachers", label: "👨‍🏫 View Teachers" },
    { id: "book", label: "📅 Book Slot" },
    { id: "myBookings", label: "📖 My Bookings" },
    { id: "notifications", label: "🔔 Notifications" },
  ];

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2>{sidebarOpen ? studentName : ""}</h2>
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>
          <ul className="menu-list">
            {sidebarItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="menu-icon">{item.label.split(" ")[0]}</span>
                <span className="menu-label">{sidebarOpen ? item.label : ""}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {message && <div className="message-box">{message}</div>}

          {activePage === "teachers" && <ViewTeachers />}
          {activePage === "book" && <BookSlot />}
          {activePage === "myBookings" && <MyBookings />}
          {activePage === "notifications" && <Notifications />}

          <Footer />
        </main>
      </div>
    </div>
  );
}
