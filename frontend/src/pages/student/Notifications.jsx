// src/pages/student/Notifications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchNotifications = async () => {
    try {
      // Student-specific notifications endpoint
      const res = await axios.get("http://127.0.0.1:8000/api/student/notifications/");
      setNotifications(res.data.reverse()); // Latest first
    } catch (err) {
      console.error("AxiosError", err);
      setMessage("❌ Failed to fetch student notifications.");
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  return (
    <div className="notifications-page" style={{ textAlign: "center", padding: "20px" }}>
      <h3>🔔 Notifications</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((note) => (
            <li
              key={note.id}
              style={{
                background: "#1a1a1a",
                color: "#fff",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <span>{note.message}</span>
              <br />
              <span style={{ color: "#aaa", fontSize: "12px" }}>
                {new Date(note.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
