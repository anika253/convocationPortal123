const express = require("express");
const router = express.Router();

const {
  adminLogin,
  adminRegister,
  getAllStudents,
  deleteStudent,
} = require("../controllers/adminController");

// Admin Register API
router.post("/register", adminRegister);

// Admin Login API
router.post("/login", adminLogin);

// Get All Students API (Only for Admin)
router.get("/students", getAllStudents);

// Delete Student API
router.delete("/student/:id", deleteStudent);

module.exports = router;
