const express = require("express");
const router = express.Router();
const Cat = require("../models/category"); // Ensure you're using Cat consistently

router.post("/add-category", async (req, res) => {
  try {
    console.log(req.body); // Add this line to check the incoming request body
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Create and save the category
    const cat = new Cat({ categoryName });
    await cat.save();

    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ message: "Failed to add category" });
  }
});

router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Cat.findOne({ categoryName }); // Find category by name

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ data: category });
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
