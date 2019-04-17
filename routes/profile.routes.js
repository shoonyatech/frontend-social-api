module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve current user profile
  app.get("/me", profile.me);

  // Create a new profile
  // app.post("/profile", profile.create);

  // Retrieve all profile
  // app.get("/profile", profile.findAll);

  // Retrieve a single profile with id
  // app.get("/profile/:id", profile.findOne);

  // Update a profile with id
  // app.put("/profile/:id", profile.update);

  // Delete a profile with id
  // app.delete("/profile/:id", profile.delete);
};
