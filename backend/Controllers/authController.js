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

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAdmin = new Admin({
      email: req.body.email,
      password: hashedPassword,
    });

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
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).json("Admin Not Found");

    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) return res.status(400).json("Invalid Credentials");

    res.status(200).json("Admin Login Successful");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Student Register

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

    // Check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      student.password
    );
    if (!validPassword) {
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
