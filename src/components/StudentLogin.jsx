import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://convocationportal123-6.onrender.com/api/auth/login",
        {
          ...form,
          role: "student", // Ensure role is sent as expected
        }
      );

      if (response.data.message === "Login successful") {
        const student = response.data.student;

        // Store student data
        localStorage.setItem("studentId", student._id);
        localStorage.setItem("studentEmail", student.email);
        localStorage.setItem("studentName", student.name);

        setMessage({ type: "success", text: "Student Login Successful!" });

        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Student Login Failed!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        {message && (
          <div
            className={`absolute top-4 left-4 px-4 py-2 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Student Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Login as Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
