// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // We’ll navigate to a route where the user chooses their role (Admin/Student)
    navigate("/choose-role?type=login");
  };

  const handleRegisterClick = () => {
    navigate("/choose-role?type=register");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome to ConvPortal</h1>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
}

export default HomePage;
