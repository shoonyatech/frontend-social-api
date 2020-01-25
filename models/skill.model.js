const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema(
  {
    name: String,
    githubStars: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Skill", SkillSchema);
