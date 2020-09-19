module.exports = app => {
    const quizRun = require("../controllers/quizRun.controller.js");
  
    // Create a new quizRun
    app.post("/quiz-run", quizRun.create);
  
    // // Update a quizRun with id
    // app.put("/quizRun/:id", quizRun.update);
  
    // // Delete a quizRun with id
    // app.delete("/quizRun/:id", quizRun.delete);
  };
  