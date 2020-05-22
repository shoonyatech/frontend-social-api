const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    dateFrom: Date,
    dateTo: Date,
    timezone: String,
    city: String,
    country: String,
    type: String, // c - conferene / m - meetup
    isOnline: Boolean,
    onlineLink: String, // zoom or other live video link
    relatedSkills: [],
    website: String,
    twitter: String,
    youtube: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    schedule: String,
    createdBy: Object,
    isPrivate: Boolean,
    isRequiresRegistration: Boolean,
    adminUsers: Array
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CityEvent", EventSchema);
