const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    feedback: String,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
