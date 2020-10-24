module.exports = (app) => {
  const userActivity = require("../controllers/user-activity.controller.js");

  // Create a new useractivity
  app.post("/useractivity", userActivity.create);
};
