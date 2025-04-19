/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const StudentHomePage = () => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get email and name from localStorage after login
    const email = localStorage.getItem('studentEmail');
    const name = localStorage.getItem('studentName');

    if (email && name) {
      setStudentEmail(email);
      setStudentName(name);
    } else {
      // Handle the case if the data is not available
      console.error('Student data not found in localStorage');
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-2xl font-bold text-blue-600">Convocation Portal</div>
        <hr className="mt-4 border-t border-gray-300" />
        <nav className="flex flex-col space-y-4 text-gray-700">
          <a href="#" className="hover:text-blue-600">Dashboard</a>
          <a href="#" className="hover:text-blue-600">Application</a>
          <a href="#" className="hover:text-blue-600">Documents</a>
          <a href="#" className="hover:text-blue-600">Instructions</a>
          <a href="#" className="hover:text-blue-600">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {studentName} 👋</h1>
          <p className="text-gray-500 mt-1">Here’s your convocation status and information.</p>
        </header>

        {/* Main dashboard items */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Application Status */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Application Status</h2>
            <p className="text-gray-600">Your application is <span className="text-green-600 font-medium">Approved</span>.</p>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Documents</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Degree Certificate</li>
              <li>Transcript</li>
              <li>ID Proof</li>
            </ul>
          </div>

          {/* Ceremony Details */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-2">Ceremony Details</h2>
            <p className="text-gray-600">Date: July 15, 2025<br />Venue: University Hall</p>
          </div>
        </div>

        {/* Important Instructions */}
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
