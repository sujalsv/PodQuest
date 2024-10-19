const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

const authMiddleware = require("../middleware/authMiddleware");

const { uploadFields } = require("../middleware/multer");

const Podcast = require("../models/Podcast"); // Import the Podcast model
const Category = require("../models/category"); // Import the Category model
const User = require("../models/user"); // Import the User model for user-related operations

router.post("/add-podcast", authMiddleware, uploadFields, async (req, res) => {
  console.log("Received a request to add a podcast");
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  try {
    const { title, description, category } = req.body;
    const frontImage = req.files["frontImage"][0].path;
    const audioFile = req.files["audioFile"][0].path;

    // Validate required fields
    if (!title || !description || !frontImage || !audioFile) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = req.user; // This should be set by your auth middleware
    const cat = await Category.findOne({ categoryName: category });

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    const catid = cat._id;
    const userid = user._id; // Ensure this is defined correctly

    // Create a new podcast
    const newPodcast = new Podcast({
      title,
      description,
      category: catid,
      frontImage,
      audioFile,
      user: userid, // Use the correctly assigned user ID
    });

    // Save the podcast
    await newPodcast.save();

    // Update the category and user with the new podcast reference
    await Category.findByIdAndUpdate(catid, {
      $push: { podcasts: newPodcast._id },
    });
    await User.findByIdAndUpdate(userid, {
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
    const podcasts = await Podcast.find({})
      .populate("category")
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    return res.status(200).json(podcasts);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get podcasts for a specific user with authentication
router.get("/get-user-podcasts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated user

    const data = await User.findById(userId)
      .populate("podcasts") // Populate podcasts associated with the user
      .select("-password"); // Exclude password from the returned user data

    if (data && data.podcasts) {
      // Sort podcasts by createdAt date
      data.podcasts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.status(200).json(data.podcasts);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get a podcast by ID
router.get("/get-podcast-by-id/:id", async (req, res) => {
  try {
    const podcastId = req.params.id;

    const podcast = await Podcast.findById(podcastId).populate(
      "category",
      "categoryName"
    ); // Populate category name

    return res.status(200).json(podcast);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route to get podcasts by category
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params; // Get category from request parameters

    // Find category by name and populate the podcasts
    const category = await Category.find({ categoryName: cat }).populate({
      path: "podcasts",
      populate: { path: "category" },
    });

    // Aggregate all podcasts from the category
    let podcasts = [];
    category.forEach((category) => {
      podcasts = [...podcasts, ...category.podcasts];
    });

    return res.status(200).json({ data: podcasts }); // Return podcasts
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
