const mongoose = require("mongoose");

const QuizParticipantsSchema = mongoose.Schema(
  {
    quizId: String,
    runId: Number,
    username: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("QuizParticipants", QuizParticipantsSchema);
