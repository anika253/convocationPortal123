// src/components/ChooseRole.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();

  // We can read the query param ?type=login or ?type=register
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type"); // 'login' or 'register'

  const handleAdminClick = () => {
    if (type === "login") {
      navigate("/login/admin");
    } else {
      navigate("/register/admin");
    }
  };

  const handleStudentClick = () => {
    if (type === "login") {
      navigate("/login/student");
    } else {
      navigate("/register/student");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Select your role</h2>
      <button onClick={handleAdminClick}>Admin</button>
      <button onClick={handleStudentClick}>Student</button>
    </div>
  );
}

export default ChooseRole;
