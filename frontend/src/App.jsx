// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "../src/pages/components/Header.jsx";
import Footer from "../src/pages/components/Footer.jsx";
import Home from "../src/pages/Home.jsx"; 
import Login from "../src/pages/pages/Login.jsx";
import Register from "../src/pages/pages/Register.jsx";
import Logout from "../src/pages/pages/Logout.jsx";

// Student Pages
import StudentDashboard from "../src/pages/pages/student/StudentDashboard.jsx";
import ViewTeachers from "../src/pages/pages/student/ViewTeachers";
import BookSlot from "../src/pages/pages/student/BookSlot";

// Teacher Pages
import TeacherDashboard from "../src/pages/pages/teacher/TeacherDashboard.jsx";

// Optional: Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Optional NotFound page
function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">404 | Page Not Found</h2>
    </div>
  );
}

function App() {
  // Protect routes by role
  const StudentRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    return role === "student" ? children : <Navigate to="/login" />;
  };

  const TeacherRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    return role === "teacher" ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />
        <Route
          path="/student/view-teachers"
          element={
            <StudentRoute>
              <ViewTeachers />
            </StudentRoute>
          }
        />
        <Route
          path="/student/book-slot"
          element={
            <StudentRoute>
              <BookSlot />
            </StudentRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
