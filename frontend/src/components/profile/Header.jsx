import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../../store/auth"; // Change this line

const Header = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get isLoggedIn state from the Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Fetch user details function
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/user-details",
          {
            withCredentials: true, // Ensure cookies are included in the request
          }
        );
        console.log(res);
        setUserData(res.data.user); // Use res to set user data
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/log-out",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout success:", res.data);
      dispatch(authActions.logoutSuccess());

      // Log the current authentication state
      console.log("Current isLoggedIn state after logout:", isLoggedIn); // This should now reflect the updated state

      navigate("/"); // Change this to the desired route after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {userData && (
        <header className="flex justify-between items-center p-4 bg-green-600 text-white w-full">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold mb-1 font-serif">Profile</h1>
            <div className="text-lg font-semibold mb-1">
              Hello, {userData.username}!
            </div>
            <div className="text-md font-medium mb-4">{userData.email}</div>
          </div>
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white py-1 px-4 rounded"
          >
            Logout
          </button>
        </header>
      )}
    </>
  );
};

export default Header;
