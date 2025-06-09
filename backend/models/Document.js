const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ use ObjectId
    ref: "Student", // ✅ reference Student model
    required: true,
  },
  filePath: { type: String, required: true },
  filename: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
