import { Link } from "react-router-dom";
import "../App.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">SlotBooking</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}