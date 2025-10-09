import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css"; // for icons
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Request JWT token
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Fetch current user info
      const profileRes = await axios.get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      const role = profileRes.data.role;
      localStorage.setItem("role", role);

      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);
      const errMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Server error";
      setMessage("❌ Login failed: " + errMsg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>

        {/* Success/Error Message */}
        {message && (
          <p style={{ color: message.startsWith("✅") ? "lightgreen" : "#ff8080" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="form-box">
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

          <button type="submit">Login</button>
        </form>

        {/* Register Link */}
        <p className="login-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
