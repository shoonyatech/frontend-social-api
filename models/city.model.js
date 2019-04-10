const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
  {
    name: String,
    description: String,
    lat: String,
    lng: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("City", CitySchema);
