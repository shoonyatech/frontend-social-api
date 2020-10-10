module.exports = (app) => {
  const freelanceProjects = require("../controllers/freelancerProjects.controller.js");

  // Retrieve all freelance
  app.get("/freelance-project", freelanceProjects.findAll);

  // Retrieve a single freelance with id
  app.get("/freelance-project/:id", freelanceProjects.findOne);

  app.get("/freelance-projects/:username", freelanceProjects.findByUsername);

  app.get("/freelances-project/skills", freelanceProjects.getAllSkills);
  app.get("/freelances-project/jobType", freelanceProjects.getAllJobType);
  app.get(
    "/freelances-project/budgetBasis",
    freelanceProjects.getAllBudgetBasis
  );
  app.get("/freelances-project/budget", freelanceProjects.getAllBudget);
  app.get(
    "/freelances-project/workDuration",
    freelanceProjects.getAllWorkDuration
  );
};
