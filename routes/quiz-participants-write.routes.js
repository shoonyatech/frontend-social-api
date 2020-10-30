module.exports = (app) => {
  const quizParticipants = require("../controllers/quiz-participants.controller.js");

  // Create a new quiz-participants
  app.post("/quiz-participants", quizParticipants.create);
};
