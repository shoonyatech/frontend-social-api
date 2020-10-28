module.exports = (app) => {
  const podcast = require("../controllers/podcast.controller.js");

  // Create a new podcast
  app.post("/podcast", podcast.create);

  // // Update a podcast with id
  app.put("/podcast/:id", podcast.update);

  // // Delete a podcast with id
  app.delete("/podcast/:id", podcast.delete);
};
