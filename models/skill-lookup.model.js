const mongoose = require("mongoose");

const SkillLookupSchema = mongoose.Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SkillLookup", SkillLookupSchema);
