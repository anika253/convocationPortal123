const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollno: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    registered: { type: Boolean, required: true },

    // ✅ New Field for Attendance Mode
    attendanceMode: {
      type: String,
      enum: ["online", "physical"],
      default: "physical",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
