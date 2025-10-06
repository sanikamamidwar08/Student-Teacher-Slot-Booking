import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Replace your old handleLogin with this new one
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/token/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Fetch current user info
      const profileRes = await axios.get("/api/me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      const role = profileRes.data.role;
      if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (error) {
      alert(
        "Login failed: " + JSON.stringify(error.response?.data || error)
      );
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
