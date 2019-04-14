const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema(
  {
    name: String,
    rating: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Skill", SkillSchema);
