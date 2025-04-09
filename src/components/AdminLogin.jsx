// src/components/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example: call /api/auth/login?role=admin on your backend if you want role-based logic
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        ...form,
        role: "admin",
      });
      alert("Admin Login Successful!");
      // localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "Admin Login Failed!");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Admin Login</h2>
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
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLogin;
