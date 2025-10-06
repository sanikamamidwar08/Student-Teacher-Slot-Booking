import { Link } from "react-router-dom";
import "../App.css";

export default function Header() {
  return (
    <header className="header">
      <h1>Slot Booking System</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/teacher/dashboard">Teacher Dashboard</Link>
        <Link to="/student/dashboard">Student Dashboard</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    </header>
  );
}
