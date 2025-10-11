import { useNavigate } from "react-router-dom";
import "../App.css";
import heroImage from "../assets/hero.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section
        className="hero-section relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="overlay absolute inset-0 bg-black opacity-50"></div>
        <div className="hero-text relative z-10 text-center text-white py-40 px-4">
          <h1 className="fade-in text-4xl md:text-6xl font-bold">
            Student–Teacher Slot Booking
          </h1>
          <p className="fade-in delay-1 mt-4 text-lg md:text-2xl">
            Book your slots or manage your teaching schedule effortlessly.
          </p>
          <div className="hero-buttons fade-in delay-2 mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary px-6 py-2 rounded-lg font-semibold"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary px-6 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
