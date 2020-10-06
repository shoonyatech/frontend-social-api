module.exports = (app) => {
  const freelance = require("../controllers/freelancing.controller.js");

  // Retrieve all freelance
  app.get("/freelance", freelance.findAll);

  // Retrieve a single freelance with id
  app.get("/freelance/:id", freelance.findOne);
};
