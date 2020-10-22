module.exports = (app) => {
  const quizRunSubmission = require("../controllers/quizRunSubmissions.controller.js");

  app.post("/quiz-run/play", quizRunSubmission.create);
};
