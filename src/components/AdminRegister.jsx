// src/components/AdminRegister.jsx
import React, { useState } from "react";
import axios from "axios";

function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the registration data along with role 'admin'
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "admin",
      });
      alert("Admin Registration Successful!");
      console.log(res.data);
      // You might want to redirect to the login page or dashboard here.
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed!");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Admin Registration</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register as Admin</button>
      </form>
    </div>
  );
}

export default AdminRegister;
