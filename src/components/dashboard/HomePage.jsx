/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const paymentRef = useRef(null);
  const instructionsRef = useRef(null);
  const paymentCardRef = useRef(null);

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
      const res = await axios.get(
        `https://convocationportal123-6.onrender.com/api/student/slip?email=${studentEmail}`,
        { responseType: "blob" }
      );
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
        `https://convocationportal123-6.onrender.com/api/docs/student/${email}`
      );
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching student documents:", error);
    }
  };

  const fetchStudent = async (email) => {
    try {
      const res = await axios.get(
        `https://convocationportal123-6.onrender.com/api/student/${email}`
      );
      const student = res.data;
      setAttendanceMode(student.attendanceMode || "");
      localStorage.setItem("studentId", student._id);
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "https://convocationportal123-6.onrender.com/api/payment/create-order"
      );

      const options = {
        key: "rzp_test_X0XGdKY89sUBlG",
        amount: 120000,
        currency: "INR",
        name: "Convo Portal",
        description: "Convocation Fee",
        order_id: data.orderId,
        handler: async function (response) {
          alert("Payment Successful! ID: " + response.razorpay_payment_id);
          setPaymentStatus("completed");

          try {
            await axios.post(
              "https://convocationportal123-6.onrender.com/api/payment/verify",
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                email: studentEmail,
              }
            );
          } catch (err) {
            console.error("Error saving payment:", err);
          }
        },
        prefill: {
          name: studentName,
          email: studentEmail,
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  const handleAttendanceChange = async (e) => {
    const selectedMode = e.target.value;
    try {
      const studentId = localStorage.getItem("studentId");
      const response = await axios.put(
        `https://convocationportal123-6.onrender.com/api/student/attendance/${studentId}`,
        { mode: selectedMode }
      );
      if (response.data.student) {
        setAttendanceMode(response.data.student.attendanceMode);
        alert("Your attendance preference has been saved successfully.");
      }
    } catch (error) {
      console.error("Failed to update attendance mode:", error);
      alert("Failed to save attendance preference. Please try again.");
      e.target.value = attendanceMode;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleHighlight = (ref, shouldScroll = true) => {
    if (shouldScroll) ref.current?.scrollIntoView({ behavior: "smooth" });
    if (ref.current) {
      ref.current.classList.add("bg-yellow-100", "transition");
      setTimeout(() => {
        ref.current.classList.remove("bg-yellow-100");
      }, 2000);
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
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-2xl font-bold text-blue-600">
          Convocation Portal
        </div>
        <hr className="mt-4 border-t border-gray-300" />
        <nav className="flex flex-col space-y-4 text-gray-700">
          <button
            onClick={() => handleHighlight(paymentRef, false)}
            className="text-left hover:text-blue-600"
          >
            Payment
          </button>
          <button
            onClick={() => navigate("/student/upload")}
            className="text-left hover:text-blue-600"
          >
            Documents
          </button>
          <button
            onClick={() => handleHighlight(instructionsRef, true)}
            className="text-left hover:text-blue-600"
          >
            Instructions
          </button>
          <button
            onClick={handleLogout}
            className="text-left hover:text-blue-600"
          >
            Logout
          </button>
        </nav>
      </aside>

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
          <div ref={paymentRef} className="bg-white rounded-xl shadow p-5">
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

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Ceremony Details</h2>
            <p className="text-gray-600">
              Date: July 15, 2025
              <br />
              Venue: University Hall
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">
              Attendance Preference
            </h2>
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">
                Select your preferred mode:
              </label>
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
        </div>

        {/* Document Status Section */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-600">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {documents.map((doc, idx) => (
                <li key={doc._id || idx} className="flex items-center justify-between">
                  <div>
                    <a
                      href={`https://convocationportal123-6.onrender.com/${doc.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 {doc.originalName || `Document ${idx + 1}`}
                    </a>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      doc.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status
                      ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
                      : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          ref={instructionsRef}
          className="mt-10 bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Important Instructions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Arrive 30 minutes before the event.</li>
            <li>Carry your ID card along with the convocation slip.</li>
            <li>
              You can download the slip once payment and document verification
              are complete.
            </li>
            <li>Dress code is formal attire.</li>
            <li>For any queries, Convo AI is ready to assist you!</li>
          </ul>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Ask ConvoBot 🤖
          </h2>
          <StudentChat />
        </div>

        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Convocation Slip 🎓
          </h2>
          <p className="text-gray-600 mb-3">
            Download your slip once payment is completed and documents are
            approved.
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
                📅 Click here to download your slip
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentHomePage;
