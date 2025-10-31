const mongoose = require("mongoose");


const phoneRegex = /^\+?[0-9]{7,15}$/; 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema(
  {
    // Name parts
    firstName: { type: String, required: [true, "First name is required"], trim: true },
    lastName:  { type: String, required: [true, "Last name is required"], trim: true },

    
    fullName:      { type: String, trim: true },     
    fullNameLower: { type: String, trim: true, unique: true }, 

    // Address
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city:         { type: String, trim: true },
    postalCode:   { type: String, trim: true },

    // Telephone / Mobile
    telHome:         { type: String, trim: true, validate: v => !v || phoneRegex.test(v) },
    telWork:         { type: String, trim: true, validate: v => !v || phoneRegex.test(v) },
    primaryMobile:   { type: String, required: [true, "Mobile number is required"], trim: true, validate: phoneRegex },
    alternateMobile: { type: String, trim: true, validate: v => !v || phoneRegex.test(v) },

    // Email
    email: { type: String, trim: true, lowercase: true, validate: v => !v || emailRegex.test(v) },

    // Country 
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: [true, "Country is required"] },
  },
  { timestamps: true }
);

// Pre-save: build fullName & normalized unique key
contactSchema.pre("save", function (next) {
  const first = (this.firstName || "").trim();
  const last  = (this.lastName || "").trim();
  this.fullName = `${first} ${last}`.trim();
  this.fullNameLower = this.fullName.toLowerCase();
  next();
});

// Ensure pre('findOneAndUpdate') also maintains derived fields
contactSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate() || {};
  const first = (update.firstName || this.get("firstName") || "").trim();
  const last  = (update.lastName  || this.get("lastName")  || "").trim();
  const full  = `${first} ${last}`.trim();
  if (!update.fullName)      this.set({ fullName: full });
  if (!update.fullNameLower) this.set({ fullNameLower: full.toLowerCase() });
  next();
});

module.exports = mongoose.model("Contact", contactSchema);
