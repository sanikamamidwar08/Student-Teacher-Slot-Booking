    // src/pages/teacher/Notifications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/");
      setNotifications(res.data.reverse()); // Latest first
    } catch (err) {
      console.error("AxiosError", err);
      setMessage("❌ Failed to fetch notifications.");
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">🔔 Notifications</h2>

      {message && (
        <p className={`mb-4 text-center font-medium ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {notifications.length === 0 ? (
        <p className="text-center text-gray-600">No new notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note) => (
            <li
              key={note.id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
            >
              <p>{note.message}</p>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(note.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
