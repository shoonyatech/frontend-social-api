const mongoose = require("mongoose");

const FreelanceSchema = mongoose.Schema(
  {
    username: String,
    aboutMe: String,
    category: String,
    relatedSkills: [],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Freelance", FreelanceSchema);
