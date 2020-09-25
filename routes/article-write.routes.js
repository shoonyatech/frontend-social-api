module.exports = (app) => {
  const article = require("../controllers/article.controller.js");

  // Create a new article
  app.post("/article", article.create);

  // Update a article with id
  app.put("/article/:id", article.update);

  // Delete a article with id
  app.delete("/article/:id", article.delete);

  // Fetch article with createdAt date
  app.get("/article/analytics/:createdAt", article.analytics);
};
