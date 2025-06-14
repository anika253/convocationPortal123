const express = require("express");
const router = express.Router();

const {
  adminLogin,
  adminRegister,
  getAllStudents,
  deleteStudent,
  updateStudentStatus, // ✅ Import this
} = require("../Controllers/adminController");

// Admin Register API
router.post("/register", adminRegister);

// Admin Login API
router.post("/login", adminLogin);

// Get All Students API (Only for Admin)
router.get("/students", getAllStudents);

// Delete Student API
router.delete("/student/:id", deleteStudent);

// ✅ Update Student Status API (approve/reject)
router.put("/status/:studentId", updateStudentStatus);

module.exports = router;
