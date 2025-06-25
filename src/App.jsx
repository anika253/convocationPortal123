import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/Home";
import ChooseRole from "./components/ChooseRole";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
import AdminRegister from "./components/AdminRegister";
import StudentRegister from "./components/StudentRegister";
import StudentHomePage from "./components/dashboard/HomePage";
import StudentUploadForm from "./components/dashboard/StudentUploadForm"; // ✅ NEW
import AdminDashboard from "./components/dashboard/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/home" element={<StudentHomePage />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/student/upload" element={<StudentUploadForm />} />
        {/* ✅ NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
