module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  app.post("/auth/facebook", profile.fbSignin);

  app.post("/auth/github", profile.githubSignin);

  app.post("/auth/twitter", profile.twitterSignin);
};
