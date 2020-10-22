module.exports = (app) => {
  const quizRunSubmission = require("../controllers/quizRunSubmissions.controller.js");

  app.get(
    "/quiz-run/result/:quizId/:runId/:questionIndex",
    quizRunSubmission.findSelectedOptionsQuestionResults
  );
  app.get(
    "/quiz-run/results/:quizId/:runId/:username",
    quizRunSubmission.findOne
  );
  app.get("/quiz-run/results/:quizId/:runId", quizRunSubmission.findAll);

  app.get(
    "/quiz-run/answer/:quizId/:questionIndex",
    quizRunSubmission.getAnswer
  );
};
