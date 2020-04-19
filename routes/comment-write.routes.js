module.exports = (app) => {
    const comment = require("../controllers/comment.controller.js");
  
    // Create a new comment
    app.post("/comment", comment.create);
  
    // Update a comment with id
    app.put("/comment/:id", tool.update);
  
    // Delete a comment with id
    app.delete("/comment/:id", tool.delete);
  };
  