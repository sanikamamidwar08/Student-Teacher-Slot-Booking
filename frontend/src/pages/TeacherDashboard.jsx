import { useState } from "react";
import ViewSchedule from "../pages/teacher/ViewSchedule";
import UpdateSchedule from "../pages/teacher/UpdateSchedule";
import ChangeSchedule from "../pages/teacher/ChangeSchedule";
import ViewBookings from "../pages/teacher/ViewBookings";
import Notifications from "../pages/teacher/Notifications";
import "../App.css";

export default function TeacherDashboard() {
  const [activePage, setActivePage] = useState("view");

  return (
    <div className="teacher-dashboard">
      {/* Navbar */}
      <nav className="teacher-navbar">
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
      </nav>

      {/* Page Content */}
      <main className="dashboard-content">
        {activePage === "view" && <ViewSchedule />}
        {activePage === "update" && <UpdateSchedule />}
        {activePage === "change" && <ChangeSchedule />}
        {activePage === "bookings" && <ViewBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
