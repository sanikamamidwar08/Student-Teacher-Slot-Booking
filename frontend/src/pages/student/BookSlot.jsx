// src/pages/student/BookSlot.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

export default function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedTeacher = location.state?.teacher || null;

  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!selectedTeacher || !selectedDate) return;

    // Only show slots for selected date & not booked
    const slots = selectedTeacher.slots.filter(
      (slot) => slot.date === selectedDate && !slot.is_booked
    );
    setAvailableSlots(slots);
    setSelectedSlot(null);
  }, [selectedTeacher, selectedDate]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return setMessage("Please select a time slot.");

    try {
      await axios.post("http://127.0.0.1:8000/api/student/book/", {
        slot: selectedSlot.id,
        purpose: "Online session",
        mode: "video",
      });

      setMessage("✅ Booking successful!");
      setSelectedSlot(null);
      setSelectedDate("");
      setAvailableSlots([]);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.detail || "❌ Booking failed. Slot may already be taken."
      );
    }
  };

  if (!selectedTeacher) {
    return (
      <div className="book-slot-page">
        <p>
          No teacher selected. Go back to{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/student/view-teachers")}
          >
            View Teachers
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="book-slot-page">
      <h3>Book Slot for {selectedTeacher.full_name || selectedTeacher.username}</h3>
      {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}

      <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {availableSlots.length > 0 && (
        <ul>
          {availableSlots.map((slot) => (
            <li key={slot.id}>
              {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}{" "}
              <button onClick={() => setSelectedSlot(slot)}>Select</button>
            </li>
          ))}
        </ul>
      )}

      {selectedSlot && (
        <div className="form-box">
          <h4>
            Booking for {selectedSlot.date} {selectedSlot.start_time}-{selectedSlot.end_time}
          </h4>
          <p>Purpose: Online session</p>
          <p>Mode: Video Call</p>
          <button onClick={handleBookingSubmit}>Confirm Booking</button>
          <button onClick={() => setSelectedSlot(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
