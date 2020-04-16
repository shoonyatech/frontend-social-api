module.exports = (app) => {
  const tool = require("../controllers/tool.controller.js");
  const toolReview = require("../controllers/tool-review.controller.js");

  // Retrieve all tool
  app.get("/tool", tool.findAll);

  // Retrieve a single tool with id
  app.get("/tool/:id", tool.findOne);

  // Retrieve all tool reviews
  app.get("/tool/:id/reviews", toolReview.findAll);
};
