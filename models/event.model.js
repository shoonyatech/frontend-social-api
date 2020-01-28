const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    dateFrom: Date,
    dateTo: Date,
    city: String,
    country: String,
    type: String, // c - conferene / m - meetup
    relatedSkills: [],
    website: String,
    twitter: String,
    youtube: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    schedule: String,
    createdBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CityEvent", EventSchema);
