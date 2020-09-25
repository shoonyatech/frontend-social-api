module.exports = (app) => {
  const job = require("../controllers/job.controller.js");

  // Create a new job
  app.post("/job", job.create);

  // Update a job with id
  app.put("/job/:id", job.update);

  // Delete a job with id
  app.delete("/job/:id", job.delete);

  // Fetch jobs with createdAt Date
  app.get("/job/analytics/:createdAt", job.analytics);
};
