const mongoose = require("mongoose");

const ToolReviewSchema = mongoose.Schema(
  {
    username: String,
    comment: String,
    toolId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ToolReview", ToolReviewSchema);
