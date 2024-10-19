// Profile.jsx
import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/profile/Header"; // Import your Header component
import Login from "./Login"; // Import your Login component
import YourPodcasts from "../components/profile/YourPodcasts";

const Profile = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Correct this line

  return (
    <>
      {isLoggedIn ? (
        <>
          <Header />
          <YourPodcasts />
        </>
      ) : (
        <Login />
      )}
    </>
  ); // Use isAuthenticated here
};

export default Profile;
