const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// Admin Register
const registerAdmin = async (req, res) => {
  try {
    // Check if email and password exist
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    // Store the password in plain text (no hashing)
    const newAdmin = new Admin({
      email: req.body.email,
      password: req.body.password, // Store password as plain text
    });

    // Save the admin to the database
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message, // More detailed error
    });
  }
};


// Admin Login
const loginAdmin = async (req, res) => {
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email: req.body.email });

    // If no admin found
    if (!admin) return res.status(400).json("Admin Not Found");

    // Directly compare plain-text passwords
    if (req.body.password !== admin.password) {
      return res.status(400).json("Invalid Credentials");
    }

    // Success response
    res.status(200).json("Admin Login Successful");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Student Register


const registerStudent = async (req, res) => {
  try {
    // Check if student already exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new student
    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      rollno: req.body.rollno,
      department: req.body.department,
      registered: req.body.registered || false, // Default to false if not provided
    });

    // Save student
    await newStudent.save();

    // Return response (excluding password)
    const studentData = newStudent.toObject();
    delete studentData.password;

    res.status(201).json({
      message: "Student registered successfully",
      student: studentData,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

// Student Login

const loginStudent = async (req, res) => {
  try {
    // Find student by email
    const student = await Student.findOne({ email: req.body.email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Check password - you can modify this part later when you implement hashing
    if (req.body.password !== student.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return response (excluding password)
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      message: "Login successful",
      student: studentData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin,
};
