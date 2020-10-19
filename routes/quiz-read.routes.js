module.exports = (app) => {
  const quiz = require("../controllers/quiz.controller.js");

  // Retrieve all quiz
  app.get("/quiz", quiz.findAll);

  // Retrieve a single quiz with id
  app.get("/quiz/:id", quiz.findOne);

  //Retrieve a single quiz with id
  app.get("/quizPlay/:id", quiz.findOneById);
};
