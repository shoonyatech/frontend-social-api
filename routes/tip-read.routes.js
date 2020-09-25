module.exports = (app) => {
  const tip = require("../controllers/tips.controller.js");

  app.get("/tip", tip.findAll);

  app.get("/tip/:id", tip.findById);

  app.get("/tips/tags", tip.getAllTags);
};
