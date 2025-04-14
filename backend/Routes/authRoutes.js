// Routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginStudent, loginAdmin } = require("../Controllers/authController");

router.post("/login", (req, res) => {
  const { role } = req.body;
  if (role === "student") return loginStudent(req, res);
  if (role === "admin") return loginAdmin(req, res);
  return res.status(400).json({ message: "Invalid role" });
});

module.exports = router;
