const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Ensure this matches
  frontImage: { type: String, required: true },
  audioFile: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assuming you have a User model
});

module.exports = mongoose.model("Podcast", podcastSchema);
