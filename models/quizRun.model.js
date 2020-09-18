const mongoose = require("mongoose");

const QuizRunSchema = mongoose.Schema(
  {
    quizId: String,
    uniqueId: Number,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("QuizRun", QuizRunSchema);
