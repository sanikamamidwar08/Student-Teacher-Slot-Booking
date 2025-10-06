import { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function ViewSchedule() {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    // Axios madhe Authorization header set kara
    const fetchSlots = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/teacher/slots/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map slots to display fields
        const mappedSlots = res.data.map((slot) => ({
          id: slot.id,
          date: new Date(slot.date).toLocaleDateString(),
          start_time: slot.start_time,
          end_time: slot.end_time,
          topic: slot.topic || "N/A",
          is_booked: slot.is_booked ? "Booked" : "Available",
        }));

        setSlots(mappedSlots);
      } catch (err) {
        console.error("AxiosError", err);
        if (err.response && err.response.status === 401) {
          setMessage("Unauthorized! Please login again.");
        } else if (err.response && err.response.status === 404) {
          setMessage("Slots endpoint not found.");
        } else {
          setMessage("Failed to fetch slots.");
        }
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="view-schedule-page">
      <h3>View Schedule</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {slots.length === 0 ? (
        <p>No slots yet.</p>
      ) : (
        <table className="slot-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>{slot.topic}</td>
                <td>{slot.is_booked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
