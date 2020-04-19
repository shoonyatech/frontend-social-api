module.exports = (app) => {
    const comment = require("../controllers/comment.controller.js");
  
    // Retrieve all comments
    app.get("/comment/:id", comment.findAll);
  };
  