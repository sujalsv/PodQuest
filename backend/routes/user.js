const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// POST route for user signup
router.post("/sign-up", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received signup request:", req.body);

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (username.length < 5) {
      return res.status(400).json({
        message: "Username must be at least 5 characters long.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUsername || existingEmail) {
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// POST route for user sign-in
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Both email and password are required." });
    }

    // Check if user exists with the provided email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("podcasterUserToken", token, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      sameSite: "none", // Ensure you handle cross-site cookies
    });

    return res.status(200).json({
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      message: "Sign-in successful.",
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// POST route for user log-out
router.post("/log-out", (req, res) => {
  res.clearCookie("podcasterUserToken", { httpOnly: true });
  return res.status(200).json({ message: "Logged out successfully." });
});

// GET route to check cookie
router.get("/check-cookie", (req, res) => {
  const token = req.cookies?.podcasterUserToken;

  if (token) {
    return res.status(200).json({ message: "User is authenticated." });
  } else {
    return res
      .status(401)
      .json({ message: "No token found, user not authenticated." });
  }
});

// GET /user-details route
router.get("/user-details", authMiddleware, async (req, res) => {
  try {
    console.log("User from middleware:", req.user); // Log user from middleware
    const { email } = req.user; // Assuming email is set in req.user by authMiddleware

    const existingUser = await User.findOne({ email: email }).select(
      "-password"
    );

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: existingUser });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
