const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  podcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Podcast" }], // Ensure this is correct
});

module.exports = mongoose.model("Category", categorySchema);
