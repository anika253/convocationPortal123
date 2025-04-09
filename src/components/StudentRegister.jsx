// src/components/StudentRegister.jsx
import React, { useState } from "react";
import axios from "axios";

function StudentRegister() {
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
      // Send the registration data along with role 'student'
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "student",
      });
      alert("Student Registration Successful!");
      console.log(res.data);
      // Optionally redirect to login page or dashboard
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed!");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Student Registration</h2>
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
        <button type="submit">Register as Student</button>
      </form>
    </div>
  );
}

export default StudentRegister;
