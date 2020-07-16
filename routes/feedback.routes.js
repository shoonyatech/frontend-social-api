module.exports = app => {
  const feedback = require("../controllers/feedback.controller.js");

  app.post("/feedback", feedback.create);
};
