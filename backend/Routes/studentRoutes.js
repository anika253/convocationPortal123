const express = require("express");
const router = express.Router();
const { addStudent, getAllStudents , getStudentByEmail } = require("../controllers/studentController");

router.post("/register", addStudent);
router.get("/", getAllStudents);
router.get("/:email", getStudentByEmail);

module.exports = router;
