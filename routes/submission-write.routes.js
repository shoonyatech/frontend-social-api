module.exports = (app) => {
  const submission = require("../controllers/submission.controller.js");
  // creating a submission
  app.post("/submission", submission.create);
  // up voting a submission
  app.put("/submission/upVote/:id", submission.upVote);
  // down voting a submission
  app.put("/submission/downVote/:id", submission.downVote);

  //deleting a submission
  app.delete("/submission/:id", submission.delete);

  app.get("/submissions/:challengeId", submission.getSubmissionsByChallengeId);
};
