import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ViewTeachers from "./pages/student/ViewTeachers"; 
import BookSlot from "./pages/student/BookSlot";

function App() {

  // Protected route for student
  const StudentRoute = ({ element }) => {
    const role = localStorage.getItem("role"); // get role here for dynamic check
    return role === "student" ? element : <Navigate to="/login" />;
  };

  // Protected route for teacher
  const TeacherRoute = ({ element }) => {
    const role = localStorage.getItem("role"); // get role here for dynamic check
    return role === "teacher" ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherRoute element={<TeacherDashboard />} />} />//

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentRoute element={<StudentDashboard />} />} />
        <Route path="/student/view-teachers" element={<StudentRoute element={<ViewTeachers />} />} />
        <Route path="/student/book-slot" element={<StudentRoute element={<BookSlot />} />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
