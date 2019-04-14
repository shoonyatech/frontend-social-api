const mongoose = require("mongoose");
const Link = require("./link.model");
const Skill = require("./skill.model");
const Conference = require("./conference.model");
const Meetup = require("./meetup.model");

const UserSchema = mongoose.Schema(
  {
    name: String,
    profilePic: String,
    email: String,
    social: [],
    skills: [],
    confAttended: [String], // id of conference
    confUpcoming: [String],
    meetupAttended: [String],
    meetupUpcoming: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
