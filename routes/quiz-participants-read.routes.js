module.exports = (app) => {
  const quizParticipants = require("../controllers/quiz-participants.controller.js");

  // Retrieve all quiz-participants
  app.get("/quiz-participants/:quizId/:runId", quizParticipants.findAll);
};
