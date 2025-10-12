import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Loging.css";

export default function Login() {
  const [username, setUsername] = useState(""); // Django default is username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login: Get JWT token
      const tokenResponse = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = tokenResponse.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 2️⃣ Get current user info (role, etc.)
      const userResponse = await axios.get("http://127.0.0.1:8000/api/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = userResponse.data;
      localStorage.setItem("role", user.role);

      // 3️⃣ Redirect based on role
      if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again."); // Show user-friendly message
    }
  };

  return (
    <div className="login-page">
      <ul>
  {Array.from({ length: 10 }).map((_, i) => (
    <li key={i}></li>
  ))}
</ul>

      <div className="login-card">
        <h2>Login</h2>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="form-box">
          {/* Username */}
          <div className="input-wrapper">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="login-link">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#ffea00" }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
