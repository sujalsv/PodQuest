const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    // Reference to User model
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Use "User" instead of "user"
    },
    podcasts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "podcasts", // Ensure this reference is correct
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
