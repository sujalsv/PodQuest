import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector for Redux
import { authActions } from "../store/auth";
import Profile from "./Profile"; // Adjust the path if necessary
import ErrorPage from "./ErrorPage";

const Login = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const dispatch = useDispatch(); // Initialize dispatch hook
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Use selector to access isLoggedIn state from Redux
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log("before login, isloggedin=", isLoggedIn);
  const handleSubmit = async (e) => {
    console.log("after login, isloggedin=", isLoggedIn);
    e.preventDefault(); // Prevent form submission
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/sign-in",
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(authActions.loginSuccess()); // Update
      navigate("/profile");

      console.log("Login success:", response.data);
      toast.success(response.data.message || "Login successful!"); // Show success toast
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("There was an error logging in!", error.response.data);
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected error:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };


  return (
    <>
      {isLoggedIn ? (
        <ErrorPage />
      ) : (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-500 to-green-800">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
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
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Login
              </button>
            </form>

            {/* Add link to signup page */}
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Login;
