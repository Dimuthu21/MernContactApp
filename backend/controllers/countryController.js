const Country = require("../models/Country");

// GET /api/countries
exports.getCountries = async (req, res) => {
  try {
    
    const countries = await Country.find().sort({ country: 1 });
    res.status(200).json(countries);
  } catch (err) {
    console.error("Error fetching countries:", err.message);
    res.status(500).json({ message: "Error fetching countries" });
  }
};

// POST /api/countries
exports.addCountry = async (req, res) => {
  try {
    const { country } = req.body;
    console.log("Received country:", country); // 🪶 Debug log

    //  Validate input
    if (!country || country.trim() === "") {
      return res.status(400).json({ message: "Country name is required" });
    }

    // 2 Check if it already exists 
    const exists = await Country.findOne({
      country: { $regex: new RegExp(`^${country}$`, "i") }, 
    });

    if (exists) {
      return res.status(400).json({ message: "Country already exists" });
    }

    // Create and save
    const newCountry = new Country({ country: country.trim() });
    await newCountry.save();

    console.log("Saved new country:", newCountry);
    res
      .status(201)
      .json({ message: "Country added successfully", data: newCountry });
  } catch (err) {
    console.error("Error adding country:", err); 
    res.status(500).json({
      message: "Error adding country",
      error: err.message, 
    });
  }
};
