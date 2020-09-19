module.exports = app => {
    const quizRun = require("../controllers/quizRun.controller.js");
  
    // // Retrieve all quizRun
    app.get("/quiz-run", quizRun.findAll);
  
    // // Retrieve a single quizRun with id
    app.get("/quiz-run/:uniqueId/:questionIndex", quizRun.findQuestionResults);  
};
  