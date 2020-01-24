module.exports = app => {
  const skill = require("../controllers/skill.controller.js");

  // Create a new skill
  app.post("/skill", skill.create);

  // Retrieve all skill
  app.get("/skill", skill.findAll);

  // Retrieve all frameworks
  app.get("/skill/frameworks", skill.findAllFrameworks);

  // Delete a skill with id
  app.delete("/skill/:id", skill.delete);
};
