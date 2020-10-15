const mongoose = require("mongoose");

const QuizRunSubmissionSchema = mongoose.Schema(
  {
    quizId: String,
    runId: Number,
    questionNo: Number,
    selectedOption: String,
    username: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("QuizRunSubmission", QuizRunSubmissionSchema);
