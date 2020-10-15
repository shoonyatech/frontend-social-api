module.exports = (app) => {
  const quizRun = require("../controllers/quizRun.controller.js");

  // Create a new quizRun
  app.post("/quiz-run", quizRun.create);

  app.put("/quiz-run/:quizId/:runId/:questionIndex", quizRun.update);
};
