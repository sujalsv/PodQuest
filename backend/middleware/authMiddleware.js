const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.podcasterUserToken; // Ensure this matches your cookie name
  console.log("Token received:", token); // Log the token

  // Return unauthorized if no token is present
  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token

    // Fetch user based on the decoded token's id
    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user); // Log the user object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in auth middleware:", error);

    // Differentiate error messages for clarity
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Apply this middleware to routes after CORS is set
module.exports = authMiddleware;
