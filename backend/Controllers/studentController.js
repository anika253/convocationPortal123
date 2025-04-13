const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

const addStudent = async (req, res) => {
  try {
    // Validate the request body for required fields
    const { name, email, rollno, department } = req.body;
    if (!name || !email || !rollno || !department) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const student = new Student(req.body);
    await student.save();

    // Destructure name and email from saved student
    const { name: studentName, email: studentEmail } = student;

    // Sending mail after successful registration
    try {
      await sendMail(
        studentEmail,
        "Registration Successful - Conv Portal",
        `Hello ${studentName},\n\nWelcome to Conv Portal! Your registration was successful.\n\nThank you!\n\nRegards,\nTeam`
      );
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      return res
        .status(500)
        .json({ message: "Student registered, but failed to send email." });
    }

    res.status(201).json({ message: "Student Registered & Email Sent" });
  } catch (err) {
    console.error("Error in addStudent:", err);
    res.status(500).json({ message: "Error adding student" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error("Error in getAllStudents:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

module.exports = { addStudent, getAllStudents };
