const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getPendingDocuments,
  updateDocumentStatus,
} = require("../Controllers/DocumentController");

// Routes (Multer is already handled inside controller)
router.post("/upload", uploadDocument);
router.get("/admin/pending", getPendingDocuments);
router.put("/admin/update/:id", updateDocumentStatus);

module.exports = router;
