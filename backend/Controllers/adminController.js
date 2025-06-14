const Admin = require("../models/Admin");
const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

// ✅ Admin Registration
exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ name, email, password }); // Plain text for testing
    await newAdmin.save();

    await sendMail(
      email,
      "Admin Registration Successful - Conv Portal",
      `Hello ${name},\n\nYour registration on Conv Portal was successful.\n\nRegards,\nTeam`
    );

    res
      .status(201)
      .json({ message: "Admin registered successfully & Mail sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Admin Login (No hashing for testing)
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Admin Login Successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const Document = require("../models/Document"); // ✅ Make sure you import this

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    // For each student, find their document
    const studentsWithDocs = await Promise.all(
      students.map(async (student) => {
        const doc = await Document.findOne({ studentId: student._id });

        return {
          ...student._doc,
          documentPath: doc?.filePath || null,
        };
      })
    );

    res.status(200).json(studentsWithDocs);
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Approve or Reject Student Status
exports.updateStudentStatus = async (req, res) => {
  const { studentId } = req.params;
  const { status, reviewedBy } = req.body; // status: "approved" | "rejected"

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.status = status;
    student.reviewedBy = reviewedBy || "Admin";

    await student.save();

    res.status(200).json({
      message: `Student status updated to ${status}`,
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
