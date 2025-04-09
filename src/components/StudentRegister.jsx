import React, { useState } from "react";
import axios from "axios";

function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Input Change Handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "student", // adding role
      });
      alert("Student Registration Successful!");
      console.log(res.data);

      // Reset form after successful registration
      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.msg || "Registration Failed!";
      alert(message);
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

        <button type="submit" style={{ marginTop: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default StudentRegister;
