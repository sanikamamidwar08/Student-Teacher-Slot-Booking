import { useNavigate } from "react-router-dom";
// Assuming 'heroImage' is the image used for the background in your original code.
// For the screenshot's look, we will use a CSS background,
// but keep the import just in case you use it elsewhere.
import heroImage from "../assets/hero.jpg";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    // The 'home-page' class will now be responsible for the full background style.
    <div className="home-page min-h-screen flex items-center justify-center p-4">
      <section
        // Center the content and give it a clean, slightly translucent white background
        // to clearly separate it from the complex background image (from the screenshot).
        className="hero-content-box bg-white/90 p-8 md:p-12 rounded-xl shadow-2xl max-w-2xl w-full text-center"
      >
        {/* Content */}
        <div className="z-10 text-gray-800">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Student–Teacher Slot Booking 🗓️
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Book your slots or manage your teaching schedule effortlessly.
          </p>

          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out px-8 py-3 rounded-full font-bold text-white shadow-lg transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out px-8 py-3 rounded-full font-bold shadow-md transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}