module.exports = app => {
    const quizRun = require("../controllers/quizRun.controller.js");
  
    // // Retrieve all quizRun
    app.get("/quizRun", quizRun.findAll);
  
    // // Retrieve a single quizRun with id
    app.get("/quizRun/:uniqueId", quizRun.findOne);  
  };
  