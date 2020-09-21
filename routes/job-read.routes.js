module.exports = app => {
  const job = require("../controllers/job.controller.js");

  // Retrieve all job
  app.get("/job", job.findAll);

  // Retrieve a single job with id
  app.get("/job/:id", job.findOne);

  app.get("/job/analytics/:createdAt", job.analytics);
};
