const mongoose = require("mongoose");

const ConferenceSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    dateFrom: Date,
    dateTo: Date,
    city: String,
    country: String,
    conferenceOrMeetup: String,
    relatedSkills: [],
    link: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Conference", ConferenceSchema);
