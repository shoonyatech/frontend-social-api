module.exports = (app) => {
  const quizRunSubmission = require("../controllers/quizRunSubmission.controller.js");

  app.get(
    "/quiz-run/result/:quizId/:runId/:questionIndex",
    quizRunSubmission.findSelectedOptionsQuestionResults
  );
  app.get(
    "/quiz-run/results/:quizId/:runId/:username",
    quizRunSubmission.findOne
  );
  app.get("/quiz-run/results/:quizId/:runId", quizRunSubmission.findAll);
};
