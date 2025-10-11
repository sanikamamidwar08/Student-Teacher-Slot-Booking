import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("role", form.role);

      setMessage("✅ Registered successfully! Redirecting...");

      setTimeout(() => {
        if (form.role === "teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Server error";
      setMessage("❌ Registration failed: " + errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Create Account
        </h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
