module.exports = app => {
  const job = require("../controllers/job.controller.js");

  // Create a new job
  app.post("/job", job.create);

  // Retrieve all job
  app.get("/job", job.findAll);

  // Retrieve a single job with id
  app.get("/job/:id", job.findOne);

  // Update a job with id
  app.put("/job/:id", job.update);

  // Delete a job with id
  app.delete("/job/:id", job.delete);
};
