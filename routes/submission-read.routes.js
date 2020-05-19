module.exports = app => {
  const submission = require("../controllers/submission.controller.js");

  // Retrieve all submissions by challenge id
  app.get("/submissions/:challengeId", submission.getSubmissionsByChallengeId);
};
