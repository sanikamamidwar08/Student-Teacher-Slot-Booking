// src/pages/student/ViewTeachers.jsx
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
        setMessage("❌ Failed to fetch teachers.");
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
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Teachers</h2>
      {message && <p className="text-red-600 mb-4">{message}</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[150px]"
        />
        <input
          type="text"
          placeholder="Search by subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[150px]"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Teacher Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTeachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="border rounded p-4 shadow hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold mb-2">{teacher.full_name || teacher.username}</h3>
              <p className="text-gray-700 mb-1">Email: {teacher.email}</p>
              {teacher.subject && <p className="text-gray-700 mb-2">Subject: {teacher.subject}</p>}

              {teacher.slots && teacher.slots.length > 0 ? (
                <button
                  onClick={() => navigate("/student/book-slot", { state: { teacher } })}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Book Slot
                </button>
              ) : (
                <p className="text-gray-500">No available slots</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
