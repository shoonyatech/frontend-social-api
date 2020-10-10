module.exports = (app) => {
  const freelanceJobApply = require("../controllers/freelanceJobApply.controller.js");

  // Create a new freelanceJobApply
  app.post("/freelanceJobApply", freelanceJobApply.create);
};
