const express = require("express");
const router = express.Router();
const { addStudent, getAllStudents } = require("../controllers/studentController");

router.post("/register", addStudent);
router.get("/", getAllStudents);

module.exports = router;
