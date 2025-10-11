import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page min-h-screen">
      <section
        className="hero-section relative bg-cover bg-center min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Student–Teacher Slot Booking
          </h1>
          <p className="text-lg md:text-2xl mb-8 animate-fade-in delay-150">
            Book your slots or manage your teaching schedule effortlessly.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-100 text-black hover:bg-gray-200 transition px-6 py-2 rounded-lg font-semibold shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
