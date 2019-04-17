module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve current user profile
  app.get("/me", profile.me);

  // Retrieve all profile
  // app.get("/profile", profile.findAll);

  // Retrieve a single profile with id
  // app.get("/profile/:id", profile.findOne);

  // Update my profile
  app.put("/me", profile.update);

  // Delete a profile with id
  // app.delete("/profile/:id", profile.delete);
};
