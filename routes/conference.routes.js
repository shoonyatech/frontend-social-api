module.exports = app => {
  const conference = require("../controllers/conference.controller.js");

  // Create a new conference
  app.post("/conference", conference.create);

  // Retrieve all conference
  app.get("/conference", conference.findAll);

  // Retrieve all conference in a city
  app.get("/conference/city/:cityName/:countryCode", conference.findAllInCity);

  // Retrieve a single conference with id
  app.get("/conference/:id", conference.findOne);

  // Update a conference with id
  app.put("/conference/:id", conference.update);

  // Delete a conference with id
  app.delete("/conference/:id", conference.delete);
};
