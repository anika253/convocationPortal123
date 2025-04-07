const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollno: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    registered: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
