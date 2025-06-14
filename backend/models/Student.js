const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollno: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    registered: { type: Boolean, required: true },

    attendanceMode: {
      type: String,
      enum: ["online", "physical"],
      default: "physical",
    },

    // ✅ New field to track approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ✅ Optional field to track who approved or rejected it
    reviewedBy: {
      type: String, // e.g., Admin email or ID
      default: null,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("Student", studentSchema);
