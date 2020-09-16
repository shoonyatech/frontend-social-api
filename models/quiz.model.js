const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema(
  {
    questionUrl: String,
    options: [],
    answer: String,
    duration: Number,
  },
  {
    timestamps: true,
  }
);
const QuizSchema = mongoose.Schema(
  {
    title: String,
    questions: [QuestionSchema],
    relatedSkills: [],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Quiz", QuizSchema);
module.exports = mongoose.model("Question", QuestionSchema);
