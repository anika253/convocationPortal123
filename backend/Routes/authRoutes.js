const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  registerStudent,
  loginStudent,
} = require("../Controllers/authController");

const router = express.Router();

// Admin Routes
router.post("/register/admin", (req, res) => {
  console.log("Request body:", req.body); // Should log { email: "...", password: "..." }
  registerAdmin(req, res);
});
router.post("/login/admin", loginAdmin);

// Student Routes
router.post("/register/student", registerStudent);
router.post("/login/student", loginStudent);

module.exports = router;
