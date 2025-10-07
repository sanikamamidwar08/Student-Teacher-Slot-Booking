// src/pages/student/ViewTeachers.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({ name: "", subject: "", date: "" });

  const token = localStorage.getItem("access_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/teachers/");
        setTeachers(res.data);
      } catch (err) {
        console.error("AxiosError", err);
        setMessage("Failed to fetch teachers.");
      }
    };

    if (token) fetchTeachers();
  }, [token]);

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    // Filter only unbooked slots
    const slots = teacher.slots ? teacher.slots.filter((slot) => !slot.is_booked) : [];
    setAvailableSlots(slots);
  };

  // Filtered teachers list
  const filteredTeachers = teachers.filter((teacher) => {
    const nameMatch = teacher.full_name
      ? teacher.full_name.toLowerCase().includes(filters.name.toLowerCase())
      : teacher.username.toLowerCase().includes(filters.name.toLowerCase());

    const subjectMatch = teacher.subject
      ? teacher.subject.toLowerCase().includes(filters.subject.toLowerCase())
      : true;

    const dateMatch = filters.date
      ? teacher.slots?.some((slot) => slot.date === filters.date)
      : true;

    return nameMatch && subjectMatch && dateMatch;
  });

  return (
    <div className="view-teachers-page">
      <h3>Available Teachers</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      {/* Teacher List */}
      <div className="teacher-list">
        {filteredTeachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <h4>{teacher.full_name || teacher.username}</h4>
              <p>Email: {teacher.email}</p>
              {teacher.subject && <p>Subject: {teacher.subject}</p>}
              <button onClick={() => handleSelectTeacher(teacher)}>
                View Available Slots
              </button>
            </div>
          ))
        )}
      </div>

      {/* Slots Section */}
      {selectedTeacher && (
        <div className="teacher-slots">
          <h4>
            Available Slots for {selectedTeacher.full_name || selectedTeacher.username}
          </h4>
          {availableSlots.length === 0 ? (
            <p>No available slots for this teacher.</p>
          ) : (
            <ul>
              {availableSlots.map((slot) => (
                <li key={slot.id}>
                  {slot.date} | {slot.start_time} - {slot.end_time} |{" "}
                  {slot.topic || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
