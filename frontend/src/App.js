import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/student/view-teachers" element={<ViewTeachers />} />
        <Route path="/student/book-slot" element={<BookSlot />} />
      
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
