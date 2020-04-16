module.exports = (app) => {
  const tool = require("../controllers/tool.controller.js");
  const toolReview = require("../controllers/tool-review.controller.js");

  // Create a new tool
  app.post("/tool", tool.create);

  // Update a tool with id
  app.put("/tool/:id", tool.update);

  // Delete a tool with id
  app.delete("/tool/:id", tool.delete);

  // Create a new tool review
  app.post("/tool/review", toolReview.create);

  // Update a tool with id
  app.put("/tool/review/:id", toolReview.update);

  // Delete a tool with id
  app.delete("/tool/review/:id", toolReview.delete);
};
