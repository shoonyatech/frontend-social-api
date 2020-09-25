module.exports = (app) => {
  const blog = require("../controllers/blog.controller.js");

  // Create a new blog
  app.post("/blog", blog.create);

  // Update a blog with id
  app.put("/blog/:id", blog.update);

  // Delete a blog with id
  app.delete("/blog/:id", blog.delete);

  //Fetch blog with createdAt Date
  app.get("/blog/analytics/:createdAt", blog.analytics);
};
