module.exports = app => {
  const challenge = require("../controllers/challenge.controller.js");

  // Retrieve all challenges
  app.get("/challenge", challenge.findAll);

  // Retrieve a single challenge with id
  app.get("/challenge/:id", challenge.findById);

  app.get("/challenge/byUniqueId/:id", challenge.findByUniqueId);
};
