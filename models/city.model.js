const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
  {
    name: String,
    title: String,
    description: String,
    photo: String,
    country: String,
    topSkills: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("City", CitySchema);
