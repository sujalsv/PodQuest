const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Cat = require("../models/category"); // Ensure you're using Cat consistently
const User = require("../models/user"); // Consistent variable naming
const { uploadFields } = require("../middleware/multer"); // Adjust the path as necessary
const Podcast = require("../models/podcast"); // Adjust the path as necessary



router.get("/categories/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;

    const foundCategory = await Cat.findOne({ categoryName }).populate({
      path: "podcasts", // Populate podcasts array
      populate: [
        { path: "category", select: "categoryName" }, // Nested populate for category
        { path: "user", select: "username" }, // Populate user, selecting specific fields if needed
      ],
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
