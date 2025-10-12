// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 'student' or 'teacher'
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    navigate("/"); // redirect to home after logout
  };

  return (
    <header className="header bg-gray-800 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer hover:text-indigo-400"
        onClick={() => navigate("/")}
      >
        Slot Booking System
      </h1>

      <nav className="flex items-center space-x-4">
        {!token && (
          <>
            <Link to="/login" className="hover:text-indigo-400">Login</Link>
            <Link to="/register" className="hover:text-indigo-400">Register</Link>
          </>
        )}

        {token && role === "teacher" && (
          <>
            <Link to="/teacher/dashboard" className="hover:text-indigo-400">
              Teacher Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold"
            >
              Logout
            </button>
          </>
        )}

        {token && role === "student" && (
          <>
            <Link to="/student/dashboard" className="hover:text-indigo-400">
              Student Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
