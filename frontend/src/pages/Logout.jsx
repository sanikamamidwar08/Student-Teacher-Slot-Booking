// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all authentication info
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 text-lg">Logging out...</p>
    </div>
  );
}
