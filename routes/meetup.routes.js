module.exports = app => {
  const meetup = require("../controllers/meetup.controller.js");

  // Create a new meetup
  app.post("/meetup", meetup.create);

  // Retrieve all meetup
  app.get("/meetup", meetup.findAll);

  // Retrieve a single meetup with id
  app.get("/meetup/:id", meetup.findOne);

  // Update a meetup with id
  app.put("/meetup/:id", meetup.update);

  // Delete a meetup with id
  app.delete("/meetup/:id", meetup.delete);
};
