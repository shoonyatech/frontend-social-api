module.exports = (app) => {
  const freelanceProjects = require("../controllers/freelancerProjects.controller.js");

  // Create a new freelance
  app.post("/freelance-project", freelanceProjects.create);

  // Update a freelance with id
  app.put("/freelance-project/:id", freelanceProjects.update);

  // Delete a freelance with id
  app.delete("/freelance-project/:id", freelanceProjects.delete);
};
