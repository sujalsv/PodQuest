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
    },
    // Reference to the Podcast model
    podcasts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Podcast", // Correct the reference to the Podcast model
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
