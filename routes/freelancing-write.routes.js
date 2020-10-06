module.exports = (app) => {
  const freelance = require("../controllers/freelancing.controller.js");

  // Create a new freelance
  app.post("/freelance", freelance.create);

  // Update a freelance with id
  app.put("/freelance/:id", freelance.update);

  // Delete a freelance with id
  app.delete("/freelance/:id", freelance.delete);
};
