import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookSlot.css";
import "../../components/Footer.css"

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

  // Filter available slots when date changes
  useEffect(() => {
    if (!selectedTeacher || !selectedDate) return;

    const slots = selectedTeacher.slots.filter(
      (slot) => slot.date === selectedDate && !slot.is_booked
    );

    setAvailableSlots(slots);
    setSelectedSlot(null);
  }, [selectedTeacher, selectedDate]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot) return setMessage("❌ Please select a time slot.");

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

  // If no teacher is selected, redirect to ViewTeachers
  if (!selectedTeacher) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>
          No teacher selected. Go back to{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Book Slot for {selectedTeacher.full_name || selectedTeacher.username}
      </h2>

      {message && (
        <p
          className={`mb-4 font-medium ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {availableSlots.length > 0 && (
        <ul className="space-y-2 mb-4">
          {availableSlots.map((slot) => (
            <li
              key={slot.id}
              className="flex justify-between items-center border p-2 rounded hover:bg-indigo-50"
            >
              <span>
                {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}
              </span>
              <button
                onClick={() => setSelectedSlot(slot)}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedSlot && (
        <div className="border p-4 rounded bg-indigo-50">
          <h3 className="font-semibold mb-2">
            Booking for {selectedSlot.date} {selectedSlot.start_time} -{" "}
            {selectedSlot.end_time}
          </h3>
          <p className="mb-1">Purpose: Online session</p>
          <p className="mb-2">Mode: Video Call</p>
          <div className="flex gap-2">
            <button
              onClick={handleBookingSubmit}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => setSelectedSlot(null)}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
