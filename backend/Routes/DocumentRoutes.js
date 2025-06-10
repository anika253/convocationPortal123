const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getPendingDocuments,
  updateDocumentStatus,
  getStudentDocuments,
} = require("../Controllers/DocumentController");

// Routes (Multer is already handled inside controller)
router.post("/upload", uploadDocument);
router.get("/admin/pending", getPendingDocuments);
router.put("/admin/update/:id", updateDocumentStatus);
router.get("/student/:email", getStudentDocuments);

module.exports = router;
