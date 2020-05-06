module.exports = app => {
  const profile = require("../controllers/profile.controller.js");

  // retrieve current user profile
  app.get("/me", profile.me);

  // Update my profile
  app.put("/me", profile.update);

  // Delete my profile
  app.delete("/me", profile.delete);

  // Update update preferences
  app.put("/profile/preferences", profile.updatePreferences);

  // retrieve current user profile
  app.get("/profile/referrals", profile.getAllReferrals);
};
