module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    // Create a new course
    app.post("/course", course.create);
  
    // Update a course with id
    app.put("/course/:id", course.update);
  
    // Delete a course with id
    app.delete("/course/:id", course.delete);
  };
  