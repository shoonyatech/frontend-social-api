module.exports = (app) => {
  const quizRunSubmission = require("../controllers/quizRunSubmission.controller.js");

  app.get(
    "/quiz-run/result/:quizId/:runId/:questionIndex",
    quizRunSubmission.findSelectedOptionsQuestionResults
  );
};
