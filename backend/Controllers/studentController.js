const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

// ✅ Register or update student
const addStudent = async (req, res) => {
  try {
    const { name, email, rollno } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollno }],
    });

    if (existingStudent) {
      if (existingStudent.status === "approved") {
        return res.status(400).json({
          message: "Student is already registered and approved.",
        });
      }

      existingStudent.set({
        ...req.body,
        status: "pending",
        registered: false,
      });

      await existingStudent.save();

      await sendMail(
        email,
        "Re-submission Successful - Conv Portal",
        `Hello ${name},\n\nYour updated registration has been submitted for review.\n\nThank you!`
      );

      return res.status(200).json({
        message: "Existing entry updated & email sent",
        student: existingStudent,
      });
    }

    const student = new Student({
      ...req.body,
      status: "pending",
      registered: false,
    });

    await student.save();

    await sendMail(
      email,
      "Registration Successful - Conv Portal",
      `Hello ${name},\n\nWelcome to Conv Portal! Your registration was successful.\n\nThank you!`
    );

    res.status(201).json({
      message: "New student registered & email sent",
      student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding student" });
  }
};

// ✅ Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ Get student by email
const getStudentByEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student" });
  }
};

// ✅ Update status (approve/reject)
const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, reviewedBy } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.status = status;
    student.reviewedBy = reviewedBy;
    student.registered = status === "approved";

    await student.save();

    await sendMail(
      student.email,
      `Your Registration has been ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`,
      `Hello ${student.name},\n\nYour registration status has been updated to "${status}".\n\nThank you!`
    );

    res
      .status(200)
      .json({ message: `Student ${status} successfully`, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
};

// ✅ Update attendance mode
const updateAttendanceMode = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mode } = req.body;

    if (!["online", "physical"].includes(mode)) {
      return res.status(400).json({ message: "Invalid attendance mode" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.attendanceMode = mode;
    await student.save();

    res.status(200).json({
      message: "Attendance mode updated successfully",
      student
    });
  } catch (error) {
    console.error("Error updating attendance mode:", error);
    res.status(500).json({ message: "Failed to update attendance mode" });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentByEmail,
  updateStudentStatus,
  updateAttendanceMode,
};
