import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminApprovalPanel.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminApprovalPanel = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ rollno: "", department: "" });

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students/");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setStudents(sorted);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const updateStudentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/status/${id}`, {
        status,
        reviewedBy: "Admin",
      });
      fetchStudents();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const exportToExcel = () => {
    const data = students.map((s) => ({
      Name: s.name,
      Email: s.email,
      RollNo: s.rollno,
      Department: s.department,
      AttendanceMode: s.attendanceMode,
      Status: s.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "registered-students.xlsx");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const rollMatch = filters.rollno
      ? s.rollno?.toLowerCase().includes(filters.rollno.toLowerCase())
      : true;
    const deptMatch = filters.department
      ? s.department?.toLowerCase().includes(filters.department.toLowerCase())
      : true;
    return rollMatch && deptMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="status-approved">✅ Approved</span>;
      case "rejected":
        return <span className="status-rejected">❌ Rejected</span>;
      default:
        return <span className="status-pending">🕓 Pending</span>;
    }
  };

  return (
    <div className="approval-panel">
      <h2 className="panel-heading">🧑‍🎓 Student Registration Dashboard</h2>

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

      {filtered.length === 0 ? (
        <p className="no-docs">No student records found</p>
      ) : (
        filtered.map((s) => (
          <div key={s._id} className="doc-card">
            <p>
              <strong>Name:</strong> {s.name}
            </p>
            <p>
              <strong>Email:</strong> {s.email}
            </p>
            <p>
              <strong>Roll No:</strong> {s.rollno}
            </p>
            <p>
              <strong>Department:</strong> {s.department}
            </p>
            <p>
              <strong>Attendance Mode:</strong> {s.attendanceMode}
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge(s.status)}
            </p>

            {s.documents?.length > 0 && (
              <p>
                <strong>Documents:</strong>{" "}
                {s.documents.map((doc, index) => (
                  <a
                    key={index}
                    className="view-doc-btn"
                    href={`http://localhost:5000/${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginRight: "8px" }}
                  >
                    📄 View Document {index + 1}
                  </a>
                ))}
              </p>
            )}

            {/* ✅ Action Buttons for Pending Status */}
            {s.status === "pending" && (
              <div className="button-group">
                <button
                  className="approve-btn"
                  onClick={() => updateStudentStatus(s._id, "approved")}
                >
                  ✅ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updateStudentStatus(s._id, "rejected")}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminApprovalPanel;
