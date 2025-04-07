const Student = require("../models/Student");

const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "Student Registered" });
  } catch (err) {
    res.status(500).json({ message: "Error adding student" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

module.exports = { addStudent, getAllStudents };
