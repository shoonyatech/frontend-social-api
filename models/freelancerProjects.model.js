const mongoose = require("mongoose");

const FreelanceSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    jobType: String,
    budgetBasis: String,
    workDuration: String,
    budget: String,
    relatedSkills: [String],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FreelanceProjects", FreelanceSchema);
