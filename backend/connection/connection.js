const mongoose = require("mongoose");

const conn = async () => {
  try {
    // Log the MongoDB URI for debugging purposes (ensure not to log sensitive information in production)
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message); // Log only the error message for better readability
  }
};

conn();
