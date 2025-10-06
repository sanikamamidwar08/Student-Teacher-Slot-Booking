// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // JWT Token request
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Get current user info
      const profileRes = await axios.get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      const role = profileRes.data.role;
      setMessage("✅ Login successful!");
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
        <h2>Login</h2>
        {message && (
          <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}
        <form onSubmit={handleLogin} className="form-box">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
