const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  getStudentByEmail,
  updateAttendanceMode,
  updateStudentStatus, // ✅ Add this import
} = require("../controllers/studentController");

router.post("/register", addStudent);
router.get("/", getAllStudents);
router.get("/:email", getStudentByEmail);
router.put("/status/:studentId", updateStudentStatus);

// ✅ New route for updating attendance mode
router.put("/attendance/:studentId", updateAttendanceMode);

module.exports = router;
