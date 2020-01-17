const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Skill", SkillSchema);
