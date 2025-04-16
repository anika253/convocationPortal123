const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

const addStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check for duplicate email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Save new student
    const student = new Student(req.body);
    await student.save();

    // Send registration email
    await sendMail(
      email,
      "Registration Successful - Conv Portal",
      `Hello ${name},\n\nWelcome to Conv Portal! Your registration was successful.\n\nThank you!`
    );

    res.status(201).json({ message: "Student Registered & Email Sent" });
  } catch (err) {
    console.error(err);
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

const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student" });
  }
};

module.exports = { addStudent, getAllStudents , getStudentByEmail };
