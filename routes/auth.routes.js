module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // fb login
  app.post("/fb-signin", profile.fbSignin);
};
