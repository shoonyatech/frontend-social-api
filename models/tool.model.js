const mongoose = require("mongoose");

const ToolSchema = mongoose.Schema(
  {
    name: String,
    section: String,
    icon: String,
    upRating: Number,
    downRating: Number,
    review: String,
    screenshot: String,
    technologies: [String],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tool", ToolSchema);
