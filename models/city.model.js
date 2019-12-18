const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
  {
    name: String,
    title: String,
    description: String,
    photo: String,
    country: String,
    lat: String,
    lng: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("City", CitySchema);
