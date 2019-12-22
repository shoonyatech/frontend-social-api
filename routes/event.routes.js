module.exports = app => {
  const event = require("../controllers/event.controller.js");

  // Create a new event
  app.post("/event", event.create);

  // Retrieve all event
  app.get("/event", event.findAll);

  // Retrieve all event
  app.get("/event/withIds", event.withIds);

  // Retrieve all event in a city
  app.get("/event/city/:cityName/:countryCode", event.findAllInCity);

  // Retrieve all event in a city
  app.get("/event/upcoming", event.findAllUpcoming);

  // Retrieve a single event with id
  app.get("/event/:id", event.findOne);

  // Update a event with id
  app.put("/event/:id", event.update);

  // Delete a event with id
  app.delete("/event/:id", event.delete);
};
