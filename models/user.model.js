const mongoose = require("mongoose");
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
    meetupUpcoming: [String],
    fbId: String,
    authToken: String,
    role: String, // <empty>/admin
    city: String,
    socialId: String,
    provider: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
