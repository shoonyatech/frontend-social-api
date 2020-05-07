module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    // Retrieve all course
    app.get("/course", course.findAll);
  
    // Retrieve a single course with id
    app.get("/course/:id", course.findOne);
  };
  