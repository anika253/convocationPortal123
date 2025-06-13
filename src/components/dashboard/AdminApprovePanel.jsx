import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminApprovalPanel.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminApprovalPanel = () => {
  const [docs, setDocs] = useState([]);
  const [filters, setFilters] = useState({ rollno: "", department: "" });

  // Fetch all pending documents
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

  // Approve or Reject document
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

  // Export filtered docs to Excel
  const exportToExcel = () => {
    const data = filteredDocs.map((doc) => ({
      Name: doc.studentId?.name || "N/A",
      Email: doc.studentId?.email || "N/A",
      RollNo: doc.studentId?.rollno || "N/A",
      Department: doc.studentId?.department || "N/A",
      AttendanceMode: doc.studentId?.attendanceMode || "N/A", // ✅ new
      Status: doc.status || "pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PendingDocs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "pending-documents.xlsx");
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Apply filters
  const filteredDocs = docs.filter((doc) => {
    const rollMatch = filters.rollno
      ? doc.studentId?.rollno
          ?.toLowerCase()
          .includes(filters.rollno.toLowerCase())
      : true;

    const deptMatch = filters.department
      ? doc.studentId?.department
          ?.toLowerCase()
          .includes(filters.department.toLowerCase())
      : true;

    return rollMatch && deptMatch;
  });

  return (
    <div className="approval-panel">
      <h2 className="panel-heading">📄 Pending Documents</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Roll No"
          value={filters.rollno}
          onChange={(e) => setFilters({ ...filters, rollno: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Department"
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
        />
        <button className="export-btn" onClick={exportToExcel}>
          📤 Export to Excel
        </button>
      </div>

      {filteredDocs.length === 0 ? (
        <p className="no-docs">No pending documents</p>
      ) : (
        filteredDocs.map((doc) => (
          <div key={doc._id} className="doc-card">
            <p>
              <strong>Student Name:</strong> {doc.studentId?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {doc.studentId?.email || "N/A"}
            </p>
            <p>
              <strong>Roll No:</strong> {doc.studentId?.rollno || "N/A"}
            </p>
            <p>
              <strong>Department:</strong> {doc.studentId?.department || "N/A"}
            </p>
            <p>
              <strong>Attendance Mode:</strong>{" "}
              {doc.studentId?.attendanceMode || "N/A"}
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
