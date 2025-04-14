import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollno: "",
    department: "",
    registered: false,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);  // Track modal visibility
  const [modalMessage, setModalMessage] = useState("");  // Track modal message

  const departments = [
    "Electronics and Communication Department",
    "Computer Science and Engineering Department",
    "Civil Engineering Department",
    "Chemical Engineering Department",
    "Electrical Engineering Department",
    "Material Engineering Department",
    "Mechanical Engineering Department",
    "Dual Degree Electronics",
    "Dual Degree Computer Science",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/student/register", {
        ...form,
        role: "student",
      });

      // Open modal and set success message
      setModalMessage("Student Registration Successful! You can now log in.");
      setModalIsOpen(true);

      console.log(res.data);

      setForm({
        name: "",
        email: "",
        password: "",
        rollno: "",
        department: "",
        registered: false,
      });
    } catch (err) {
      setModalMessage(err.response?.data?.msg || "Registration Failed!");
      setModalIsOpen(true);
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Student Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Roll Number
            </label>
            <input
              type="text"
              name="rollno"
              value={form.rollno}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-white focus:ring-indigo-500 focus:outline-none"
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="registered"
              checked={form.registered}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <label className="text-sm text-gray-700">Registered</label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
      </div>
      {modalIsOpen && (
        <div
          className="fixed top-0 right-0 m-3 p-3 bg-green-600 text-white rounded-lg shadow-lg"
          style={{
            zIndex: 9999, 
            maxWidth: "250px", 
            fontSize: "14px", 
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Registration Status</h3>
            <button onClick={closeModal} className="text-lg font-bold">
              X
            </button>
          </div>
          <p className="mt-2 text-xs">{modalMessage}</p>
        </div>
      )}
    </div>
  );
}

export default StudentRegister;
