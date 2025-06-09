import React from "react";
import AdminApprovalPanel from "./AdminApprovePanel";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome Admin!</h1>
      <p>This is your dashboard.</p>

      {/* Insert the document approval panel here */}
      <AdminApprovalPanel />

      {/* Add other dashboard widgets/components below */}
    </div>
  );
};

export default AdminDashboard;
