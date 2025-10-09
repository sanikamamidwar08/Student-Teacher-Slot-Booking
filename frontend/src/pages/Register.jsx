import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome for icons
import "../App.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    role: "student", // default role
  });

  const [message, setMessage] = useState(""); // success/error message
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Form submit handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous message

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/", form, {
        headers: { "Content-Type": "application/json" },
      });

      // Save role to localStorage for dashboard redirect
      localStorage.setItem("role", form.role);

      setMessage("✅ Registered successfully! Redirecting to dashboard...");

      // Redirect based on role after short delay
      setTimeout(() => {
        if (form.role === "teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Registration Error:", error);
      const errMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Server error";
      setMessage("❌ Registration failed: " + errMsg);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>

        {/* Success/Error Message */}
        {message && (
          <p style={{ color: message.startsWith("✅") ? "lightgreen" : "#ff8080" }}>
            {message}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="form-box">

          <div className="input-wrapper">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <i className="fas fa-user-tag"></i>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button type="submit">Register</button>
        </form>

        {/* Login Link */}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
