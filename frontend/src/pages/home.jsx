import "../App.css";
import heroImage from "../assets/hero.jpg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="overlay"></div>
        <div className="hero-text">
          <h1 className="fade-in">Student–Teacher Slot Booking</h1>
          <p className="fade-in delay-1">
            Book your slots or manage your teaching schedule effortlessly.
          </p>
          <div className="hero-buttons fade-in delay-2">
            <button onClick={() => navigate("/register")} className="btn-primary">
              Get Started
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary">
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
