const mongoose = require("mongoose");

const UserSkillSchema = mongoose.Schema(
  {
    name: String,
    noOfYears: Number,
    rating: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("UserSkill", UserSkillSchema);
