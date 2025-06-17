// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have a StudentChat component

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/choose-role?type=login");
  };

  const handleRegisterClick = () => {
    navigate("/choose-role?type=register");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Welcome to ConvPortal
        </h1>
        <div className="space-x-4">
          <button
            onClick={handleLoginClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-md"
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl shadow-md"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
