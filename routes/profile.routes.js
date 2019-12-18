module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve current user profile
  app.get("/me", profile.me);

  // Update my profile
  app.put("/me", profile.update);

  // Delete my profile
  app.delete("/me", profile.delete);

  // retrieve user with a given username
  app.get("/user/:username", profile.findByUsername);

  // get list of all users from a given city
  app.get("/user/from/:cityName/:countryCode", profile.findUsersInCity);
};
