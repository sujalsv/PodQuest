const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const userApi = require("./routes/user.js");
const CatApi = require("./routes/categories.js");
const PodcastApi = require("./routes/podcast.js");
require("dotenv").config();
require("./connection/connection.js");

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true, 
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser()); // Move this above the routes

// All routes
app.use("/api/v1", userApi);
app.use("/api/v1", CatApi);
app.use("/api/v1", PodcastApi);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
