import React from "react";
import AdminApprovalPanel from "./AdminApprovePanel";
import "./AdminDashboard.css"; // 👈 Import the CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="welcome-banner">
        <h1>Welcome Admin! 👋</h1>
        <p>This is your dashboard where you can manage document approvals.</p>
      </div>

      <AdminApprovalPanel />

      {/* Future dashboard widgets/components can go here */}
    </div>
  );
};

export default AdminDashboard;
