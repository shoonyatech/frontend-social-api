const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema(
  {
    questionNo: Number,
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
    moderators: [],
    relatedSkills: [],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Question", QuestionSchema);
module.exports = mongoose.model("Quiz", QuizSchema);
