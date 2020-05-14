module.exports = app => {
  const challenge = require("../controllers/challenge.controller.js");

  // Create a new challenge
  app.post("/challenge", challenge.create);

  // Update a challenge with id
  app.put("/challenge/:id", challenge.update);

  // Delete a challenge with id
  app.delete("/challenge/:id", challenge.delete);
};
