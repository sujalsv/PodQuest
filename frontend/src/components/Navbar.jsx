import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoReorderThreeOutline } from "react-icons/io5";
import { logoutSuccess } from "../store/auth"; // Import logout action

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Access isLoggedIn from Redux state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutSuccess()); // Call logout action
  };

  // Define navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "All Podcasts", path: "/all-podcasts" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="flex items-center">
        <img
          src="https://png.pngtree.com/png-vector/20210307/ourmid/pngtree-line-style-microphone-podcast-radio-logo-png-image_3010529.jpg"
          alt="PodQuest Logo"
          className="w-10 h-10 mr-2"
        />
        <h1 className="text-2xl font-bold">PodQuest</h1>
      </div>

      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        <IoReorderThreeOutline size={30} />
      </div>

      <div className="hidden md:flex space-x-4">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="text-white hover:text-yellow-500"
          >
            {link.name}
          </Link>
        ))}

        {isLoggedIn && (<Link to="/profile" className="text-white hover:text-yellow-500">
              Profile
            </Link>
        ) }
         {!isLoggedIn&&
          <>
            <Link to="/login" className="text-white hover:text-yellow-500">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:text-yellow-500">
              Sign Up
            </Link>
          </>
        }
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 bg-gray-800 w-full md:hidden">
          <div className="flex flex-col items-center space-y-4 p-4">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="text-white hover:text-yellow-500"
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-yellow-500"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-yellow-500">
                  Login
                </Link>
                <Link to="/signup" className="text-white hover:text-yellow-500">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
