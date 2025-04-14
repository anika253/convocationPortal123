import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);  // Track modal visibility
  const [modalMessage, setModalMessage] = useState("");  // Track modal message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", {
        ...form,
        role: "admin",
      });

      // Open modal and set success message
      setModalMessage(res.data.message);
      setModalIsOpen(true);

      console.log(res.data);
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
          Admin Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register as Admin
          </button>
        </form>
      </div>

      {/* Toast-like modal for success or error messages */}
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
            <h3 className="font-semibold">Registration Status</h3>
            <button onClick={closeModal} className="text-xl font-bold">
              X
            </button>
          </div>
          <p className="mt-2">{modalMessage}</p>
        </div>
      )}
    </div>
  );
}

export default AdminRegister;
