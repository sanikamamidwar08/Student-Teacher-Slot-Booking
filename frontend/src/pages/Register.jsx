import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowWelcome(false);

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("role", form.role);
      setMessage("✅ Registered successfully!");
      setShowWelcome(true);

      setTimeout(() => {
        if (form.role === "teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      }, 2500);
    } catch (error) {
      const errMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Server error";
      setMessage("❌ Registration failed: " + errMsg);
    }
  };

  return (
    <div className="register-container">
      {/* 🌟 Floating Bubbles */}
      <ul className="bubbles">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      <div className="register-box">
        <h2 className="register-title">Create Account</h2>

        {message && (
          <p
            className={`message ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}

        {showWelcome && (
          <div className="welcome-animation">
            👋 Welcome, <span>{form.full_name || "Asha"}</span>!
          </div>
        )}

        <form onSubmit={handleRegister} className="form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
