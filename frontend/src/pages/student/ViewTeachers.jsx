import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({ name: "", subject: "", date: "" });
  const navigate = useNavigate();

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

      <div className="teacher-list">
        {filteredTeachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <h4>{teacher.full_name || teacher.username}</h4>
              <p>Email: {teacher.email}</p>
              {teacher.subject && <p>Subject: {teacher.subject}</p>}
              <button
                onClick={() =>
                  navigate("/student/book-slot", { state: { teacher } })
                }
              >
                Book Slot
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
