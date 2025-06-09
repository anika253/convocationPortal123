import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminApprovalPanel.css"; // ✅ CSS is already linked

const AdminApprovalPanel = () => {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/docs/admin/pending"
      );
      setDocs(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/docs/admin/update/${id}`, {
        status,
      });
      fetchDocs(); // refresh list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="approval-panel">
      <h2 className="panel-heading">📄 Pending Documents</h2>
      {docs.length === 0 ? (
        <p className="no-docs">No pending documents</p>
      ) : (
        docs.map((doc) => (
          <div key={doc._id} className="doc-card">
            <p>
              <strong>Student Name:</strong> {doc.studentId?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {doc.studentId?.email || "N/A"}
            </p>

            <a
              href={`http://localhost:5000/${doc.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="view-link"
            >
              🔍 View Document
            </a>

            <div className="button-group">
              <button
                className="approve-btn"
                onClick={() => updateStatus(doc._id, "approved")}
              >
                ✅ Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => updateStatus(doc._id, "rejected")}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminApprovalPanel;
