const Student = require("../models/Student");
const sendMail = require("../utils/mailer");

const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();

    // Sending mail after successful registration
    await sendMail(
      email,
      "Registration Successful - Conv Portal",
      `Hello ${student.name},\n\nWelcome to Conv Portal! Your registration was successful.\n\nThank you!`
    );

    res.status(201).json({ message: "Student Registered & Email Sent" });
  } catch (err) {
    console.log(err);
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

module.exports = { addStudent, getAllStudents };
