import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/token/", form);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // fetch current user
      const profileRes = await axios.get("/api/me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      const role = profileRes.data.role;
      if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (error) {
      alert("Login failed: " + JSON.stringify(error.response?.data || error));
    }
  };

  return (
    <div className="form-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form-box">
        <input
          type="text"
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
  );
}
