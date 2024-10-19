const multer = require("multer");

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create the multer upload instance
const upload = multer({
  storage: storage
});

// Export the middleware with specified fields
const uploadFields = upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
]);

module.exports = { uploadFields }; // Ensure this line is correct
