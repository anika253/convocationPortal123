import React, { useState } from "react";
import axios from "axios";
import "./StudentUploadForm.css";

const StudentUploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      setMessage("Student not logged in ❌");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("studentId", studentId); // ✅ use actual ID

    try {
      await axios.post("http://localhost:5000/api/docs/upload", formData);
      setMessage("Uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed ❌");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2 className="upload-title">Upload Document</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="upload-input"
          />
          <button type="submit" className="upload-button">
            Upload
          </button>
        </form>
        <p className="upload-message">{message}</p>
      </div>
    </div>
  );
};

export default StudentUploadForm;
