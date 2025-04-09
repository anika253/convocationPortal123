import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/Home";
import ChooseRole from "./components/ChooseRole";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
// Same idea for Register pages if separate
import AdminRegister from "./components/AdminRegister";
import StudentRegister from "./components/StudentRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Role Selection */}
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Admin Login */}
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Student Login */}
        <Route path="/login/student" element={<StudentLogin />} />

        {/* Admin Register */}
        <Route path="/register/admin" element={<AdminRegister />} />

        {/* Student Register */}
        <Route path="/register/student" element={<StudentRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
