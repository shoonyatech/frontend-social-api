module.exports = app => {
  const auth = require("../controllers/auth.controller.js");

  app.post("/auth/facebook", auth.fbSignin);

  app.post("/auth/github", auth.githubSignin);

  app.post("/auth/twitter", auth.twitterSignin);

  app.post("/auth/google", auth.googleSignin);
};
