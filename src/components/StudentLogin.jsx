// src/components/StudentLogin.jsx
import React, { useState } from "react";
import axios from "axios";

function StudentLogin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example: call /api/auth/login?role=student
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        ...form,
        role: "student",
      });
      alert("Student Login Successful!");
      // localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "Student Login Failed!");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Student Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login as Student</button>
      </form>
    </div>
  );
}

export default StudentLogin;
