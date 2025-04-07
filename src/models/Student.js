const mongoose = require("mongoose");
const studentSchema = new mongoose.schema(
  {
    name: { type: string, required: true },
    email: { type: string, required: true, unique: true },
    rollno: { type: string, required: true, qunique: true },
    department: { type: string, required: true },
    registered: { type: boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
