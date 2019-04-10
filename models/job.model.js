const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    skils: [String],
    company: String,
    duration: [String],
    level: String,
    tags: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", JobSchema);
