const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    skils: [String],
    company: String,
    city: String,
    isFullTime: Boolean,
    isPartTime: Boolean,
    isRemote: Boolean,
    isPermanent: Boolean,
    isContract: Boolean,
    level: Number,
    tags: [String],
    link: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", JobSchema);
