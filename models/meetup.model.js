const mongoose = require("mongoose");

const MeetupSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    dateFrom: String,
    dateTo: String,
    location: String,
    relatedSkills: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meetup", MeetupSchema);
