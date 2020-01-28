module.exports = app => {
  const event = require("../controllers/event.controller.js");

  // Create a new event
  app.post("/event", event.create);

  // Update a event with id
  app.put("/event/:id", event.update);

  // Delete a event with id
  app.delete("/event/:id", event.delete);
};
