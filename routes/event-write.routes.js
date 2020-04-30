module.exports = app => {
  const event = require("../controllers/event.controller.js");

  // Create a new event
  app.post("/event", event.create);

  // Update a event with id
  app.put("/event/:id", event.update);

  app.post("/event/:id/create-meeting", event.createMeeting);

  app.get("/event/:id/privateMeetings", event.findPrivateMeetings);

  // Delete a event with id
  app.delete("/event/:id", event.delete);

  //Register users for the event
  app.post("/event/register", event.registerUser);
  
  //Register users for the event
  app.get("/event/get/myevent", event.findMyEvent);
};
