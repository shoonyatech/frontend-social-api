module.exports = (app) => {
  const freelanceJobApply = require("../controllers/freelanceJobApply.controller.js");

  // Retrieve all freelanceJobApply
  app.get("/freelanceJobApply", freelanceJobApply.findAll);

  // Retrieve a single freelanceJobApply with id
  app.get("/freelanceJobApply/:id", freelanceJobApply.findOne);
};
