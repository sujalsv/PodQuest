const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Cat = require("../models/category"); // Ensure you're using Cat consistently
const User = require("../models/user"); // Consistent variable naming
const { uploadFields } = require("../middleware/multer"); // Adjust the path as necessary
const Podcast = require("../models/podcast"); // Adjust the path as necessary

router.post("/add-podcast", authMiddleware, uploadFields, async (req, res) => {
  console.log("Received a request to add a podcast");
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  try {
    const { title, description, category: categoryName } = req.body; // Use consistent variable names
    const frontImage = req.files["frontImage"][0].path;
    const audioFile = req.files["audioFile"][0].path;

    // Validate required fields
    if (!title || !description || !frontImage || !audioFile) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!categoryName) {
      return res.status(400).json({ message: "Category is required" });
    }

    const user = req.user; // This should be set by your auth middleware
    const normalizedCategory = categoryName.toLowerCase();

    // Use a case-insensitive regex to find the category
    const foundCategory = await Cat.findOne({
      categoryName: new RegExp(`^${normalizedCategory}$`, "i"), // Case-insensitive match
    });

    if (!foundCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = foundCategory._id; // Renamed for clarity
    const userId = user._id; // Consistent naming

    // Create a new podcast
    const newPodcast = new Podcast({
      title,
      description,
      category: categoryId, // Use the consistent variable name
      frontImage,
      audioFile,
      user: userId, // Use the consistent variable name
    });

    // Save the podcast
    await newPodcast.save();

    // Update the category and user with the new podcast reference
    await Cat.findByIdAndUpdate(categoryId, {
      $push: { podcasts: newPodcast._id },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { podcasts: newPodcast._id },
    });

    res.status(201).json({ message: "Podcast added successfully" });
  } catch (error) {
    console.error(error); // Log the error for better debugging
    res
      .status(500)
      .json({ message: "Failed to add podcast", error: error.message });
  }
});

router.get("/categories/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;

    const foundCategory = await Cat.findOne({ categoryName }).populate({
      path: "podcasts", // Populate podcasts array
      populate: { path: "user" }, // Populate user if needed
    });

    if (!foundCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const podcasts = foundCategory.podcasts || []; // Directly access podcasts

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Failed to fetch category" });
  }
});

// List of frontend categories
const frontendCategories = [
  "Comedy",
  "Sports",
  "Politics",
  "Education",
  "Technology",
  "Health",
  "Music",
  "Science",
  "History",
  "Travel",
];

// GET /categories route
router.get("/categories", async (req, res) => {
  try {
    // Fetch all categories from MongoDB
    const categories = await Cat.find(); // Use 'Cat' instead of 'Category'
    return res.status(200).json(categories); // Send the fetched categories to frontend
  } catch (error) {
    console.error("Error fetching categories:", error); // Log error to console
    return res.status(500).json({ message: "Error fetching categories" }); // Send error message to frontend
  }
});

module.exports = router;
