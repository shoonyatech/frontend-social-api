const mongoose = require("mongoose");

const QuizRunSchema = mongoose.Schema(
  {
    quizId: String,
    runId: Number,
    isActive: Boolean,
    currentQuestion: Number,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("QuizRun", QuizRunSchema);
