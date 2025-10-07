// src/pages/teacher/TeacherDashboard.jsx
import { useState } from "react";
import ViewBookings from "./ViewBookings";
import "../../App.css";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("viewBookings");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <h2>Teacher Dashboard</h2>
        <ul>
          <li
            className={activeTab === "viewBookings" ? "active" : ""}
            onClick={() => setActiveTab("viewBookings")}
          >
            View Bookings
          </li>
          <li
            className={activeTab === "addSlots" ? "active" : ""}
            onClick={() => setActiveTab("addSlots")}
          >
            Add Slots
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="dashboard-content">
        {activeTab === "viewBookings" && <ViewBookings />}
        {activeTab === "addSlots" && (
          <div>
            <h3>Add New Slots</h3>
            <p>Here teacher can add new available slots for students.</p>
            {/* AddSlot form/component can go here */}
          </div>
        )}
      </div>
    </div>
  );
}
