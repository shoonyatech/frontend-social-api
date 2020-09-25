module.exports = (app) => {
  const article = require("../controllers/article.controller.js");

  // Retrieve all article
  app.get("/article", article.findAll);

  // Retrieve a single article with id
  app.get("/article/:id", article.findOne);
};
