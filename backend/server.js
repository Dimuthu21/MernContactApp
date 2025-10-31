const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const countryRoutes = require("./routes/countryRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Use API routes
app.use("/api/countries", countryRoutes);
app.use("/api/contacts", contactRoutes);

// Default test route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
