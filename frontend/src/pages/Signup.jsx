import React, { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify

const Signup = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/sign-up",
        formData
      );
      console.log("Signup success:", response.data); // Log the success response
      toast.success(response.data.message); // Show success toast
      navigate('/login');
    } catch (error) {
      // Check if there is a response and it contains data
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Log the error response for debugging
        console.error("There was an error signing up!", error.response.data);
        // Show the exact error message from the backend
        toast.error(error.response.data.message); // Show backend-defined error message
      } else {
        alert(error.response.data.message);
        toast.error(
          "An unexpected error occurred. Please try again.",
          error.response.data.message
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Add link to login page */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Signup;
