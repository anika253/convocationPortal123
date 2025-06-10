const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");
const Student = require("../models/Student"); // ✅ needed for student-email-based query

// ======================
// Multer Storage Config
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// =====================
// File Filter for Valid Types
// =====================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed"));
  }
};

// =====================
// Multer Upload Instance
// =====================
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("document");

// =====================
// Upload Document Controller
// =====================
const uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    try {
      const doc = new Document({
        studentId,
        filePath: req.file.path,
        filename: req.file.filename,
        status: "pending",
        uploadedAt: new Date(),
      });

      await doc.save();

      res.status(200).json({
        message: "Document uploaded successfully",
        document: doc,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });
};

// =====================
// Get All Pending Documents (Admin)
// =====================
const getPendingDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ status: "pending" }).populate(
      "studentId",
      "name email"
    );
    res.json(docs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// =====================
// Update Status (Admin Approve/Reject)
// =====================
const updateDocumentStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    await Document.findByIdAndUpdate(id, { status });
    res.json({ message: `Document status updated to ${status}` });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update document status" });
  }
};

// =====================
// ✅ New: Get Student Documents by Email
// =====================
const getStudentDocuments = async (req, res) => {
  const { email } = req.params;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const documents = await Document.find({ studentId: student._id });
    res.json(documents);
  } catch (error) {
    console.error("Get Student Docs Error:", error);
    res.status(500).json({ error: "Failed to fetch student documents" });
  }
};

// =====================
// Export All Controllers
// =====================
module.exports = {
  uploadDocument,
  getPendingDocuments,
  updateDocumentStatus,
  getStudentDocuments, // ✅ export this new one
};
