const express = require("express");
const {
  addStudent,
  getAllStudents,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/add", addStudent);
router.get("/all", getAllStudents);

module.exports = router;
