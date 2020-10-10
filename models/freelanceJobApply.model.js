const mongoose = require("mongoose");

const FreelanceJobApplySchema = mongoose.Schema(
  {
    jobId: String,
    freelancerId: String,
    type: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("freelanceJobApply", FreelanceJobApplySchema);
