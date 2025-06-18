const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  getStudentByEmail,
  updateAttendanceMode,
  updateStudentStatus,
  generateConvocationSlip,
} = require("../Controllers/StudentController");

router.post("/register", addStudent);
router.get("/", getAllStudents);
router.get("/:email", getStudentByEmail);
router.put("/status/:studentId", updateStudentStatus);
router.get("/slip/:email", generateConvocationSlip); // ✅ No verifyStudent

// ✅ Attendance update
router.put("/attendance/:studentId", updateAttendanceMode);

module.exports = router;
