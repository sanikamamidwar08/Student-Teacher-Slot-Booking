import { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

export default function BookSlot({ selectedTeacher }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({ purpose: "", topics: "", attachments: null, mode: "video" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (!selectedTeacher || !selectedDate) return;
    const slots = selectedTeacher.slots.filter(
      slot => slot.date === selectedDate && !slot.is_booked
    );
    setAvailableSlots(slots);
    setSelectedSlot(null);
  }, [selectedTeacher, selectedDate]);

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
    } catch (err) {
      console.log(err);
      setMessage("Booking failed. Slot may already be taken.");
    }
  };

  return (
    <div className="book-slot-page">
      <h3>Book Slot</h3>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {selectedTeacher ? (
        <>
          <div>
            <label>Select Date: </label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>

          {availableSlots.length > 0 && (
            <ul>
              {availableSlots.map(slot => (
                <li key={slot.id}>
                  {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}
                  <button onClick={() => setSelectedSlot(slot)}>Select</button>
                </li>
              ))}
            </ul>
          )}

          {selectedSlot && (
            <form className="form-box" onSubmit={handleBookingSubmit}>
              <h4>Booking for {selectedSlot.date} {selectedSlot.start_time}-{selectedSlot.end_time}</h4>
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
        </>
      ) : (
        <p>Please select a teacher first.</p>
      )}
    </div>
  );
}
