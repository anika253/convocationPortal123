/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StudentChat from "./StudentChat";

const StudentHomePage = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [attendanceMode, setAttendanceMode] = useState("");
  const [slipUrl, setSlipUrl] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    const name = localStorage.getItem("studentName");

    const fetchAllData = async () => {
      try {
        if (email && name) {
          setStudentEmail(email);
          setStudentName(name);
          await Promise.all([fetchDocuments(email), fetchStudent(email)]);
        } else {
          console.error("Student data not found in localStorage");
        }
      } catch (error) {
        console.error("Error loading student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  const fetchSlip = async () => {
    try {
      const token = localStorage.getItem("studentToken"); // ✅ JWT from login
      const res = await axios.get("http://localhost:5000/api/student/slip", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important to handle PDF/Blob
      });

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      setSlipUrl(fileURL);
    } catch (error) {
      console.error("Error generating slip:", error);
      alert(
        "Could not generate slip. Please ensure your payment and documents are approved."
      );
    }
  };

  const fetchDocuments = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/docs/student/${email}`
      );
      setDocuments(res.data); // ✅ Now handles multiple documents
    } catch (error) {
      console.error("Error fetching student documents:", error);
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
    try {
      const studentId = localStorage.getItem("studentId");
      const response = await axios.put(
        `http://localhost:5000/api/student/attendance/${studentId}`,
        { mode: selectedMode }
      );

      if (response.data.student) {
        setAttendanceMode(response.data.student.attendanceMode);
        alert("Your attendance preference has been saved successfully.");
      }
    } catch (error) {
      console.error("Failed to update attendance mode:", error);
      alert("Failed to save attendance preference. Please try again.");
      // Revert the select value to the previous state
      e.target.value = attendanceMode;
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
          <Link to="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/payment" className="hover:text-blue-600">
            Payment
          </Link>
          <Link to="/documents" className="hover:text-blue-600">
            Documents
          </Link>
          <Link to="/instructions" className="hover:text-blue-600">
            Instructions
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-left hover:text-blue-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome! 👋</h1>
          <p className="text-gray-500 mt-1">
            Hello, {studentName} ({studentEmail})
          </p>
          <p className="text-gray-500 mt-1">
            Here's your convocation status and information.
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Documents</h2>
              <button
                onClick={() => fetchDocuments(studentEmail)}
                className="text-sm text-blue-600 hover:underline"
              >
                🔄 Refresh Status
              </button>
            </div>

            <p>
              Upload the photo of your identity card by clicking on the
              documents option in the sidebar.
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
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Preference</h2>
          <div className="flex items-center space-x-4">
            <label className="text-gray-700">Select your preferred mode:</label>
            <select
              value={attendanceMode}
              onChange={handleAttendanceChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="physical">Physical Attendance</option>
              <option value="online">Online Attendance</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Current preference:{" "}
            <span className="font-medium">{attendanceMode || "Not set"}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Important Instructions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Arrive 30 minutes before the event.</li>
            <li>Carry your ID card along with the convocation slip.</li>
            <li>
              {" "}
              You can download the slip once you are done with payment and
              document verification and they accepted
            </li>
            <li>Dress code: Formal attire.</li>
          </ul>
        </div>
        {/* AI Chatbot Section */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Ask ConvoBot 🤖
          </h2>
          <StudentChat />
        </div>
        {/* Convocation Slip Download Section */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Convocation Slip 🎓
          </h2>
          <p className="text-gray-600 mb-3">
            Download your slip once payment is completed and documents are
            approved.You need to carry this slip at the day of convocation along
            with ur ID card.
          </p>
          <button
            onClick={fetchSlip}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Generate Convocation Slip
          </button>

          {slipUrl && (
            <div className="mt-4">
              <a
                href={slipUrl}
                download="Convocation_Slip.pdf"
                className="text-blue-600 hover:underline"
              >
                📥 Click here to download your slip
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentHomePage;
