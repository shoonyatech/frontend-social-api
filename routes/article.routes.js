module.exports = app => {
  const article = require("../controllers/article.controller.js");

  // Create a new article
  app.post("/article", article.create);

  // Retrieve all article
  app.get("/article", article.findAll);

  // Retrieve a single article with id
  app.get("/article/:id", article.findOne);

  // Update a article with id
  app.put("/article/:id", article.update);

  // Delete a article with id
  app.delete("/article/:id", article.delete);
};
