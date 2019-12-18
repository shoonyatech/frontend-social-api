module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve current user profile
  app.get("/me", profile.me);

  // Update my profile
  app.put("/me", profile.update);

  // Delete my profile
  app.delete("/me", profile.delete);

  // retrieve current user profile
  app.get("/user/:username", profile.findByUsername);

  // Retrieve all profile
  // app.get("/profile", profile.findAll);

  // Retrieve a single profile with id
  // app.get("/profile/:id", profile.findOne);
};
