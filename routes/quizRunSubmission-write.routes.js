module.exports = (app) => {
  const quizRunSubmission = require("../controllers/quizRunSubmission.controller.js");

  app.post("/quiz-run/play", quizRunSubmission.create);
};
