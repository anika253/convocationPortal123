// src/components/ChooseRole.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type"); // 'login' or 'register'

  const handleAdminClick = () => {
    navigate(type === "login" ? "/login/admin" : "/register/admin");
  };

  const handleStudentClick = () => {
    navigate(type === "login" ? "/login/student" : "/register/student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {type === "login" ? "Login As" : "Register As"}
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleAdminClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-200"
          >
            Admin
          </button>
          <button
            onClick={handleStudentClick}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-200"
          >
            Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseRole;
