const mongoose = require("mongoose");

const FreelanceSchema = mongoose.Schema(
  {
    username: String,
    name: String,
    aboutMe: String,
    city: String,
    country: String,
    category: String,
    relatedSkills: [],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Freelance", FreelanceSchema);
