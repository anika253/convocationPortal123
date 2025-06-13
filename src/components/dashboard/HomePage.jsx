/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentHomePage = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [attendanceMode, setAttendanceMode] = useState(""); // 👈 Attendance mode

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    const name = localStorage.getItem("studentName");

    if (email && name) {
      setStudentEmail(email);
      setStudentName(name);
      fetchDocuments(email);
      fetchStudent(email); // 👈 fetch attendance mode too
    } else {
      console.error("Student data not found in localStorage");
      setLoading(false);
    }
  }, []);

  const fetchDocuments = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/docs/student/${email}`
      );
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching student documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/student/${email}`);
      const student = res.data;
      setAttendanceMode(student.attendanceMode || "");
      localStorage.setItem("studentId", student._id);
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const handlePayment = () => {
    alert("Redirecting to payment gateway...");
    setPaymentStatus("completed");
  };

  const handleAttendanceChange = async (e) => {
    const selectedMode = e.target.value;
    setAttendanceMode(selectedMode);
    try {
      const studentId = localStorage.getItem("studentId");
      await axios.put(
        `http://localhost:5000/api/student/attendance/${studentId}`,
        {
          mode: selectedMode,
        }
      );
      alert("Your preference has been saved.");
    } catch (error) {
      console.error("Failed to update attendance mode:", error);
      alert("Failed to save preference.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-2xl font-bold text-blue-600">
          Convocation Portal
        </div>
        <hr className="mt-4 border-t border-gray-300" />
        <nav className="flex flex-col space-y-4 text-gray-700">
          <a href="#" className="hover:text-blue-600">
            Dashboard
          </a>
          <a href="#" className="hover:text-blue-600">
            Payment
          </a>
          <Link to="/documents" className="hover:text-blue-600">
            Documents
          </Link>
          <a href="#" className="hover:text-blue-600">
            Instructions
          </a>
          <a href="#" className="hover:text-blue-600">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome! 👋</h1>
          <p className="text-gray-500 mt-1">
            Here’s your convocation status and information.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Payment Status</h2>
            <p className="text-gray-600 mb-3">
              Your payment is{" "}
              <span
                className={`font-medium ${
                  paymentStatus === "completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {paymentStatus === "completed" ? "Completed" : "Pending"}
              </span>
              .
            </p>
            {paymentStatus !== "completed" && (
              <button
                onClick={handlePayment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Make Payment
              </button>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Documents</h2>
            <p>
              Upload the photo of your identity card by clicking on documents
              option in side bar.
            </p>
            {documents.length === 0 ? (
              <p className="text-gray-500 mt-2">No documents uploaded yet.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                {documents.map((doc) => (
                  <li key={doc._id}>
                    📄 {doc.filename} –{" "}
                    <span
                      className={`font-medium ${
                        doc.status === "approved"
                          ? "text-green-600"
                          : doc.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Ceremony Details */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Ceremony Details</h2>
            <p className="text-gray-600">
              Date: July 15, 2025
              <br />
              Venue: University Hall
            </p>
          </div>
        </div>

        {/* Attendance Preference */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Attendance Preference</h2>
          <p className="text-gray-700 mb-2">
            How would you like to attend the convocation ceremony?
          </p>
          <select
            value={attendanceMode}
            onChange={handleAttendanceChange}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">-- Select Mode --</option>
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Important Instructions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Arrive 30 minutes before the event.</li>
            <li>Carry your admit card and ID proof.</li>
            <li>Dress code: Formal attire.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StudentHomePage;
