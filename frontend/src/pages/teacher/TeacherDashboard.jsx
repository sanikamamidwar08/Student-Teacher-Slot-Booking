// src/pages/teacher/TeacherDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewSchedule from "./ViewSchedule";
import UpdateSchedule from "./UpdateSchedule";
import ChangeSchedule from "./ChangeSchedule";
import ViewBookings from "./ViewBookings";
import Notifications from "./Notifications";
import axios from "axios";
import "../../App.css";

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
    { id: "view", label: "📅 View Schedule" },
    { id: "update", label: "➕ Update Schedule" },
    { id: "change", label: "✏️ Change Schedule" },
    { id: "bookings", label: "📖 View Bookings" },
    { id: "notifications", label: "🔔 Notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`font-bold text-lg ${sidebarOpen ? "block" : "hidden"}`}>
            👩‍🏫 Teacher
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <ul className="mt-4">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer px-4 py-2 hover:bg-indigo-100 rounded-l-lg transition ${
                activePage === item.id ? "bg-indigo-200 font-semibold" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              {sidebarOpen ? item.label : item.label.split(" ")[0]}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {message && <p className="text-red-600 mb-4 font-medium">{message}</p>}

        {activePage === "view" && <ViewSchedule />}
        {activePage === "update" && <UpdateSchedule />}
        {activePage === "change" && <ChangeSchedule />}
        {activePage === "bookings" && <ViewBookings />}
        {activePage === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
