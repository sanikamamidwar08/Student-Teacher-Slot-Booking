import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../App.css";

export default function StudentDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({ purpose: "", topics: "", attachments: null, mode: "video" });
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (!token) console.log("No access token found! Please login first.");
  else axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Fetch teachers and their available slots
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/student/slots/");
      /**
       * Expected backend response:
       * [
       *   { teacher_id, teacher_name, subjects (optional), slots: [{id, date, start_time, end_time, topic, is_booked}, ...] },
       *   ...
       * ]
       */
      setTeachers(res.data);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch teachers and slots.");
    }
  };

  // Fetch student bookings
  const fetchMyBookings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/student/bookings/");
      setMyBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Update available slots whenever teacher or date changes
  useEffect(() => {
    if (!selectedTeacher) return;
    const dateStr = selectedDate.toISOString().split("T")[0];
    const slots = (selectedTeacher.slots || []).filter(slot => slot.date === dateStr && !slot.is_booked);
    setAvailableSlots(slots);
    setSelectedSlot(null);
  }, [selectedDate, selectedTeacher]);

  useEffect(() => {
    if (token) {
      fetchTeachers();
      fetchMyBookings();
    }
  }, [token]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setBookingForm({ ...bookingForm, [name]: files[0] });
    else setBookingForm({ ...bookingForm, [name]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return setMessage("Please select a time slot.");

    const formData = new FormData();
    formData.append("teacher_slot", selectedSlot.id);
    formData.append("purpose", bookingForm.purpose);
    formData.append("topics", bookingForm.topics);
    formData.append("mode", bookingForm.mode);
    if (bookingForm.attachments) formData.append("attachments", bookingForm.attachments);

    try {
      await axios.post("http://127.0.0.1:8000/api/student/book/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Booking successful!");
      setBookingForm({ purpose: "", topics: "", attachments: null, mode: "video" });
      setSelectedSlot(null);
      fetchMyBookings();
      fetchTeachers();
    } catch (err) {
      console.log(err);
      setMessage("Booking failed. Slot may already be taken.");
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Student Dashboard</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>Browse Teachers</h3>
      <div className="teacher-list">
        {teachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          teachers.map(teacher => (
            <div key={teacher.teacher_id} className="teacher-card">
              <h4>{teacher.teacher_name}</h4>
              <p>Subjects: {teacher.subjects?.join(", ") || "N/A"}</p>
              <button onClick={() => setSelectedTeacher(teacher)}>View Slots</button>
            </div>
          ))
        )}
      </div>

      {selectedTeacher && (
        <div className="calendar-section">
          <h3>Available Slots for {selectedTeacher.teacher_name}</h3>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={({ date }) =>
              (selectedTeacher.slots || []).some(slot => slot.date === date.toISOString().split("T")[0] && !slot.is_booked)
                ? "has-slot"
                : null
            }
          />

          <h4>Slots on {selectedDate.toDateString()}</h4>
          {availableSlots.length === 0 ? (
            <p>No available slots on this date.</p>
          ) : (
            <ul>
              {availableSlots.map(slot => (
                <li key={slot.id}>
                  {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}
                  <button onClick={() => setSelectedSlot(slot)}>Select</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedSlot && (
        <form className="form-box" onSubmit={handleBookingSubmit}>
          <h3>Book Slot: {selectedSlot.date} {selectedSlot.start_time}-{selectedSlot.end_time}</h3>
          <input
            type="text"
            name="purpose"
            value={bookingForm.purpose}
            onChange={handleFormChange}
            placeholder="Purpose"
            required
          />
          <input
            type="text"
            name="topics"
            value={bookingForm.topics}
            onChange={handleFormChange}
            placeholder="Topics/Questions"
          />
          <input type="file" name="attachments" onChange={handleFormChange} />
          <select name="mode" value={bookingForm.mode} onChange={handleFormChange}>
            <option value="video">Video Call</option>
            <option value="offline">Offline</option>
          </select>
          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={() => setSelectedSlot(null)}>Cancel</button>
        </form>
      )}

      <h3>My Bookings</h3>
      <Calendar
        value={new Date()}
        tileClassName={({ date }) =>
          myBookings.some(b => b.date === date.toISOString().split("T")[0])
            ? "my-booking"
            : null
        }
      />
      <ul>
        {myBookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          myBookings.map(b => (
            <li key={b.id}>
              {b.teacher_name} | {b.date} {b.start_time}-{b.end_time} | {b.status}
              <button /* cancel/reschedule logic */>Cancel</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
