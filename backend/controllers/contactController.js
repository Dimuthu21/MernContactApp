const Contact = require("../models/Contact");

// GET all contacts 
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact
      .find()
      .populate("countryId", "country")
      .sort({ fullNameLower: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts", error: err.message });
  }
};

// POST (Save) new contact
exports.addContact = async (req, res) => {
  try {
    const {
      firstName, lastName,
      addressLine1, addressLine2, city, postalCode,
      telHome, telWork, primaryMobile, alternateMobile,
      email, countryId
    } = req.body;

    
    if (!firstName || !lastName || !primaryMobile || !countryId) {
      return res.status(400).json({ message: "First name, last name, country, and mobile are required" });
    }

   
    const contact = new Contact({
      firstName, lastName,
      addressLine1, addressLine2, city, postalCode,
      telHome, telWork, primaryMobile, alternateMobile,
      email, countryId
    });

    await contact.save(); 

    res.status(201).json({ message: "Contact saved successfully", data: contact });
  } catch (err) {
    
    if (err.code === 11000 && err.keyPattern && err.keyPattern.fullNameLower) {
      return res.status(400).json({ message: "A contact with this Name already exists" });
    }
    res.status(500).json({ message: "Error saving contact", error: err.message });
  }
};

// PUT (Update) contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    
    const updated = await Contact.findOneAndUpdate(
      { _id: id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact updated successfully", data: updated });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.fullNameLower) {
      return res.status(400).json({ message: "A contact with this Name already exists" });
    }
    res.status(500).json({ message: "Error updating contact", error: err.message });
  }
};

// DELETE contact (hard delete per assignment)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contact", error: err.message });
  }
};
