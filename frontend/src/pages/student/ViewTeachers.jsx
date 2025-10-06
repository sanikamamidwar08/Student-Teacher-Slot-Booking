// src/pages/student/ViewTeachers.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/teachers/");
        setTeachers(res.data);
      } catch (err) {
        console.log("AxiosError", err);
        setMessage("Failed to fetch teachers.");
      }
    };

    if (token) fetchTeachers();
  }, [token]);

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    // Filter available slots for this teacher; handle undefined slots
    const slots = teacher.slots ? teacher.slots.filter(slot => !slot.is_booked) : [];
    setAvailableSlots(slots);
  };

  return (
    <div className="view-teachers-page">
      <h3>Available Teachers</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <div className="teacher-list">
        {teachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <h4>{teacher.full_name || teacher.username}</h4>
              <p>Email: {teacher.email}</p>
              <button onClick={() => handleSelectTeacher(teacher)}>
                View Available Slots
              </button>
            </div>
          ))
        )}
      </div>

      {selectedTeacher && (
        <div className="teacher-slots">
          <h4>Available Slots for {selectedTeacher.full_name || selectedTeacher.username}</h4>
          {availableSlots.length === 0 ? (
            <p>No available slots for this teacher.</p>
          ) : (
            <ul>
              {availableSlots.map((slot) => (
                <li key={slot.id}>
                  {slot.date} | {slot.start_time} - {slot.end_time} | {slot.topic || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
