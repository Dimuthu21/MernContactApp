const express = require("express");
const router = express.Router();
const { getCountries, addCountry } = require("../controllers/countryController");

// Define endpoints
router.get("/", getCountries);   
router.post("/", addCountry);    

module.exports = router;
