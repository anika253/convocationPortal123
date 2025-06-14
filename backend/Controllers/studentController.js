const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

// Add a new student
const addStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check for duplicate email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Save new student with default status = "pending" and registered = false
    const student = new Student({
      ...req.body,
      status: "pending",
      registered: false,
    });

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

// Get all students, sorted with pending ones on top
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ status: 1, createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Get a student by email
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

// ✅ Update attendance mode only
const updateAttendanceMode = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mode } = req.body;

    if (!["online", "physical"].includes(mode)) {
      return res.status(400).json({ message: "Invalid attendance mode" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { attendanceMode: mode },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Attendance mode updated",
      student: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating attendance mode" });
  }
};

// ✅ Update status (approve/reject) and registered field together
const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const registered = status === "approved"; // true for approved, false otherwise

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { status, registered },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: `Student ${status}`,
      student: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student status" });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentByEmail,
  updateAttendanceMode,
  updateStudentStatus,
};
