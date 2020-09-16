module.exports = app => {
    const quiz = require("../controllers/quiz.controller.js");
  
    // Create a new quiz
    app.post("/quiz", quiz.create);
  
    // Update a quiz with id
    app.put("/quiz/:id", quiz.update);
  
    // Delete a quiz with id
    app.delete("/quiz/:id", quiz.delete);
  };
  