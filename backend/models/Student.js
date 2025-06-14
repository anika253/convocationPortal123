const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    rollno: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    registered: {
      type: Boolean,
      required: true,
    },

    attendanceMode: {
      type: String,
      enum: ["online", "physical"],
      default: "physical",
    },

    // 🟡 Status for approval (used in admin panel)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    documentPath: {
      type: String,
      default: "",
    },

    // 🟡 Document reviewer (optional)
    reviewedBy: {
      type: String, // Admin name or ID
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Student", studentSchema);
