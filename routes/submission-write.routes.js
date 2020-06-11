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

  //posting a new comment
  app.post("/submissions/:id/comment", submission.addComment);

  //deleting a comment
  app.delete('/submissions/:id/comment/:commentId', submission.deleteComment);
 
  //updating a comment
  app.put('/submissions/:id/comment/:commentId', submission.updateComment);
};
