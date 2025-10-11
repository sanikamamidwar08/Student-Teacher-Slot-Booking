import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ViewTeachers from "./pages/student/ViewTeachers"; 
import BookSlot from "./pages/student/BookSlot";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // Protected route for students
  const StudentRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    return role === "student" ? children : <Navigate to="/login" />;
  };

  // Protected route for teachers
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

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
