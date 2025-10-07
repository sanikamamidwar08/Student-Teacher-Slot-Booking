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
    const slots = selectedTeacher.slots.filter(
      (slot) => slot.date === selectedDate && !slot.is_booked
    );
    setAvailableSlots(slots);
    setSelectedSlot(null);
  }, [selectedTeacher, selectedDate]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return setMessage("Please select a time slot.");

    // Backend expects 'slot' field
    const data = {
      slot: selectedSlot.id,
      purpose: "Online session",
      mode: "video",
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/student/book/", data);
      setMessage("Booking successful!");
      setSelectedSlot(null);
      setSelectedDate("");
      setAvailableSlots([]);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.detail || "Booking failed. Slot may already be taken."
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
      {message && <p style={{ color: "green" }}>{message}</p>}

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
              {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}
              <button onClick={() => setSelectedSlot(slot)}>Select</button>
            </li>
          ))}
        </ul>
      )}

      {selectedSlot && (
        <div className="form-box">
          <h4>
            Booking for {selectedSlot.date} {selectedSlot.start_time}-
            {selectedSlot.end_time}
          </h4>
          <p>Purpose: Online session</p>
          <p>Mode: Video Call</p>
          <button onClick={handleBookingSubmit}>Confirm Booking</button>
          <button type="button" onClick={() => setSelectedSlot(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
