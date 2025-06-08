const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder in backend/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

// File type filter (PDF, JPG, JPEG, PNG only)
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

// Set multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
}).single("document");

// Upload document controller using multer middleware
exports.uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const doc = new Document({
        studentId: req.body.studentId || "demoStudent", // Replace with real auth user later
        filePath: req.file.path,
        filename: req.file.filename,
        status: "pending",
        uploadedAt: new Date(),
      });

      await doc.save();
      res
        .status(200)
        .json({ message: "Document uploaded successfully", document: doc });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });
};

// Get all pending documents
exports.getPendingDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ status: "pending" });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Update document status (approve/reject)
exports.updateDocumentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await Document.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Document status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update document status" });
  }
};
