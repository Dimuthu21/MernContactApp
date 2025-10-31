const mongoose = require("mongoose");

const countrySchema=new mongoose.Schema({
    country:{
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
});

module.exports=mongoose.model("Country",countrySchema);