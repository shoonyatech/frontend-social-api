module.exports = (app) => {
  const tool = require("../controllers/tool.controller.js");

  // Create a new tool
  app.post("/tool", tool.create);

  // Update a tool with id
  app.put("/tool/:id", tool.update);

  // Delete a tool with id
  app.delete("/tool/:id", tool.delete);
};
