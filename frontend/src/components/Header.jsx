import { Link, useNavigate } from "react-router-dom";
import "../App.css";

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
    <header className="header">
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Slot Booking System
      </h1>
      <nav>
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && role === "teacher" && (
          <>
            <Link to="/teacher/dashboard">Teacher Dashboard</Link>
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </>
        )}

        {token && role === "student" && (
          <>
            <Link to="/student/dashboard">Student Dashboard</Link>
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

const logoutBtnStyle = {
  marginLeft: "10px",
  padding: "6px 12px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#e74c3c",
  color: "#fff",
  fontWeight: "bold"
};
