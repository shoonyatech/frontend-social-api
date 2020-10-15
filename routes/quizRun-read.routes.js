module.exports = (app) => {
  const quizRun = require("../controllers/quizRun.controller.js");

  // // Retrieve all quizRun
  app.get("/quiz-run", quizRun.findAll);
  app.get("/quiz-run/:quizId", quizRun.findOne);

  // // Retrieve a single quizRun with id
  app.get("/quiz-run/:runId/:questionIndex", quizRun.findQuestionResults);
};
