module.exports = (app) => {
  const userActivity = require("../controllers/user-activity.controller.js");

  // Get User Activity
  app.get("/useractivity/:username", userActivity.findAllByUser);
};
