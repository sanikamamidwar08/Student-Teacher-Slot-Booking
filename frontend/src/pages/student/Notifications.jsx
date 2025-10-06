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
      // Generic notifications endpoint for both students and teachers
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.log("AxiosError", err);
      setMessage("Failed to fetch notifications.");
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  return (
    <div className="notifications-page">
      <h3>Notifications</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map(note => (
            <li key={note.id}>
              {note.message}{" "}
              <span style={{ color: "gray", fontSize: "12px" }}>
                {new Date(note.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
