// src/components/dashboard/AdminApprovalPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApprovalPanel = () => {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const res = await axios.get("http://localhost:5000/api/docs/admin/pending");
    setDocs(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/docs/admin/update/${id}`, {
      status,
    });
    fetchDocs(); // refresh list
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <h2>Pending Documents</h2>
      {docs.length === 0 ? (
        <p>No pending documents</p>
      ) : (
        docs.map((doc) => (
          <div
            key={doc._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>Student: {doc.studentId}</p>
            <a
              href={`http://localhost:5000/${doc.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View Document
            </a>
            <br />
            <button onClick={() => updateStatus(doc._id, "approved")}>
              Approve
            </button>
            <button onClick={() => updateStatus(doc._id, "rejected")}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminApprovalPanel;
