const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer"); // Importing the sendMail function

// ----------------------- Admin Register -----------------------
const registerAdmin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newAdmin = new Admin({
      email: req.body.email,
      password: hashedPassword,
    });

    await newAdmin.save();

    // Send confirmation email to Admin
    await sendMail(
      req.body.email,
      "Admin Registration Successful",
      "Hello Admin,\n\nYour registration was successful!\n\nRegards,\nTeam"
    );

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    console.error("Admin Registration error:", err);
    res.status(500).json({
      message: "Admin registration failed",
      error: err.message,
    });
  }
};

// ----------------------- Admin Login -----------------------
const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).json({ message: "Admin Not Found" });

    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid Credentials" });

    res.status(200).json({ message: "Admin Login Successful" });
  } catch (err) {
    res.status(500).json({
      message: "Admin login failed",
      error: err.message,
    });
  }
};

// ----------------------- Student Register -----------------------
const registerStudent = async (req, res) => {
  try {
    const existingStudent = await Student.findOne({
      $or: [{ email: req.body.email }, { rollno: req.body.rollno }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message:
          existingStudent.email === req.body.email
            ? "Email already in use"
            : "Roll number already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      rollno: req.body.rollno,
      department: req.body.department,
      registered: req.body.registered || false,
    });

    await newStudent.save();

    // Send confirmation email to Student
    await sendMail(
      req.body.email,
      "Student Registration Successful",
      `Hello ${req.body.name},\n\nYou have been successfully registered!\n\nRegards,\nTeam`
    );

    const studentData = newStudent.toObject();
    delete studentData.password;

    res.status(201).json({
      message: "Student registered successfully",
      student: studentData,
    });
  } catch (err) {
    console.error("Student Registration error:", err);
    res.status(500).json({
      message: "Student registration failed",
      error: err.message,
    });
  }
};

// ----------------------- Student Login -----------------------
const loginStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      student.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      message: "Login successful",
      student: studentData,
    });
  } catch (err) {
    console.error("Student Login error:", err);
    res.status(500).json({
      message: "Student login failed",
      error: err.message,
    });
  }
};

// Export all functions
module.exports = {
  registerAdmin,
  loginAdmin,
  registerStudent,
  loginStudent,
};
