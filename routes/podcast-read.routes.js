module.exports = (app) => {
  const podcast = require("../controllers/podcast.controller.js");

  //   // Retrieve all podcast
  app.get("/podcast", podcast.findAll);

  //   // Retrieve a single podcast with id
  app.get("/podcast/:id", podcast.findOne);
};
