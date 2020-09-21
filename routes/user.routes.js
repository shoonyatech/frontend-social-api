module.exports = (app) => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve user with a given username
  app.get("/user/:username", profile.findByUsername);

  // get list of all users from a given city
  app.get("/user/from/:cityName/:countryCode", profile.findUsersInCity);

  app.get("/users", profile.findAll);
  //retrieve user with a given date
  app.get("/users/analytics/:createdAt", profile.analytics);
};
