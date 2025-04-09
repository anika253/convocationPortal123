import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      alert("Login Successful!");
      console.log(res.data);
      // localStorage.setItem("token", res.data.token); // if token given
    } catch (err) {
      alert(err.response.data.msg || "Login Failed!");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
