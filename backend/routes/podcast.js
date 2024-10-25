const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

const authMiddleware = require("../middleware/authMiddleware");
const { uploadFields } = require("../middleware/multer");

const Podcast = require("../models/podcast"); // Import the Podcast model
const Cat = require("../models/category"); // Import the Category model
const User = require("../models/user"); // Import the User model for user-related operations

// Remove this console log or change it to 'Cat'
console.log(Cat); // Correctly log the imported category model
console.log(Podcast);

// Route to add a new podcast
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

// Route to get all podcasts
router.get("/get-podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find({}).populate({
      path: "category",
      select: "categoryName",
    });

    console.log("Retrieved podcasts:", podcasts); // Log the entire podcasts array

    // Log the category of each podcast
    podcasts.forEach((podcast, index) => {
      console.log(`Podcast ${index + 1} category:`, podcast.category);
    });

    return res.status(200).json(podcasts);
  } catch (error) {
    console.error("Error occurred while retrieving podcasts:", error); // Log the error
    return res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete-all-podcasts", async (req, res) => {
  try {
    // Delete all podcasts from the database
    await Podcast.deleteMany({}); // This will remove all podcast documents

    // Optionally, you may want to also remove all references from users and categories
    await User.updateMany({}, { $set: { podcasts: [] } }); // Clear podcasts array from all users
    await Cat.updateMany({}, { $set: { podcasts: [] } }); // Clear podcasts array from all categories

    return res
      .status(200)
      .json({ message: "All podcasts deleted successfully." });
  } catch (error) {
    console.error("Error occurred while deleting podcasts:", error); // Log the error
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get podcasts for a specific user with authentication
router.get("/get-user-podcasts", authMiddleware, async (req, res) => {
  console.log("User info from middleware:", req.user); // Check if req.user is defined

  try {
    const userId = req.user._id;

    const data = await User.findById(userId)
      .populate({
        path: "podcasts",
        populate: { path: "category", select: "categoryName" },
      })
      .select("-password");

    if (data && data.podcasts) {
      data.podcasts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.status(200).json(data.podcasts);
    }

    return res
      .status(404)
      .json({ message: "No podcasts found for this user." });
  } catch (error) {
    console.error("Error retrieving user podcasts:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get a podcast by ID
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const podcastId = req.params.id;

    const podcast = await Podcast.findById(podcastId).populate(
      "category",
      "categoryName"
    ); // Consistent use of 'category' and 'categoryName'

    return res.status(200).json(podcast);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get podcasts by category
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params; // Get category from request parameters

    const normalizedCategory = cat.toLowerCase(); // Normalize to lowercase (same as in /add-podcast)

    // Find category by normalized name and populate the podcasts
    const category = await Cat.find({
      categoryName: normalizedCategory,
    }).populate({
      path: "podcasts",
      populate: { path: "category" }, // Consistent use of 'category'
    });

    // Aggregate all podcasts from the category
    let podcasts = [];
    category.forEach((category) => {
      podcasts = [...podcasts, ...category.podcasts];
    });

    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
