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

  const sidebarItems = [
    { id: "teachers", label: "👨‍🏫 View Teachers" },
    { id: "book", label: "📅 Book Slot" },
    { id: "myBookings", label: "📖 My Bookings" },
    { id: "notifications", label: "🔔 Notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-center">Student Dashboard</h2>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`cursor-pointer px-3 py-2 rounded-md hover:bg-indigo-100 ${
                activePage === item.id ? "bg-indigo-600 text-white font-semibold" : "text-gray-700"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {message && <p className="text-red-600 mb-4">{message}</p>}

        {activePage === "teachers" && <ViewTeachers />}
        {activePage === "book" && <BookSlot />}
        {activePage === "myBookings" && <MyBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
