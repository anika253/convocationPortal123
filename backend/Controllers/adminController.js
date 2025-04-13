const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcrypt"); // ✅ Using native bcrypt
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

// Admin Registration
exports.adminRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });

    await newAdmin.save();

    // Send confirmation email
    await sendMail(
      email,
      "Admin Registration Successful - Conv Portal",
      `Hello Admin,\n\nYour registration on Conv Portal was successful.\n\nRegards,\nTeam`
    );

    res
      .status(201)
      .json({ message: "Admin registered successfully & mail sent" });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
