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
      <aside className="sidebar">
        <h2>Teacher Dashboard</h2>
        <ul>
          <li onClick={() => setActivePage("view")}>📅 View Schedule</li>
          <li onClick={() => setActivePage("update")}>➕ Update Schedule</li>
          <li onClick={() => setActivePage("change")}>✏️ Change Schedule</li>
          <li onClick={() => setActivePage("bookings")}>📖 View Bookings</li>
          <li onClick={() => setActivePage("notifications")}>🔔 Notifications</li>
        </ul>
      </aside>

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
