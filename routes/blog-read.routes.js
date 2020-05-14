module.exports = app => {
    const blog = require("../controllers/blog.controller.js");
  
    // Retrieve all blog
    app.get("/blog", blog.findAll);
  
    // Retrieve a single blog with id
    app.get("/blog/:id", blog.findOne);  
  };
  