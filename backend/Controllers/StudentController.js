const Student = require("../models/Student");
const sendMail = require("../utils/mailer");
const PDFDocument = require("pdfkit");

// Register or update student
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

//  Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

//  Get student by email
const getStudentByEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student" });
  }
};

// Update status (approve/reject)
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

//  Update attendance mode
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
      student,
    });
  } catch (error) {
    console.error("Error updating attendance mode:", error);
    res.status(500).json({ message: "Failed to update attendance mode" });
  }
};

const Document = require("../models/Document");
const Payment = require("../models/Payment");

const generateConvocationSlip = async (req, res) => {
  const studentEmail = req.params.email;

  try {
    const student = await Student.findOne({ email: studentEmail });
    if (!student || !student.paymentDone) {
      return res.status(400).json({ error: "Payment not completed." });
    }

    const documents = await Document.find({ studentId: student._id });
    const allApproved = documents.every((doc) => doc.status === "Approved");

    if (!allApproved) {
      return res.status(400).json({ error: "All documents not approved." });
    }

    // Generate PDF
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment;filename=ConvocationSlip.pdf",
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    doc.fontSize(20).text("NIT Hamirpur Convocation Slip", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${student.name}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Roll Number: ${student.rollno}`);
    doc.text(`Batch: ${student.batch || "2021-2025"}`);
    doc.moveDown();
    doc.text(`✅ Payment Verified`);
    doc.text(`✅ All Documents Approved`);
    doc.moveDown();
    doc.text(`🎓 Venue: Institute Hall`);
    doc.text(`🗓️ Date: 25th July 2025`);
    doc.end();
  } catch (err) {
    console.error("Error generating slip:", err.message);
    res.status(500).json({ error: "Server error generating slip." });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentByEmail,
  updateStudentStatus,
  updateAttendanceMode,
  generateConvocationSlip,
};

