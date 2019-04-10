module.exports = app => {
  const city = require("../controllers/city.controller.js");

  // Create a new city
  app.post("/city", city.create);

  // Retrieve all city
  app.get("/city", city.findAll);

  // Retrieve a single city with id
  app.get("/city/:id", city.findOne);

  // Update a city with id
  app.put("/city/:id", city.update);

  // Delete a city with id
  app.delete("/city/:id", city.delete);
};
