module.exports = (app) => {
  const tip = require("../controllers/tips.controller.js");

  app.post("/tip", tip.create);

  app.put("/tip/:id", tip.update);

  app.delete("/tip/:id", tip.delete);

  app.get("/tip/analytics/:createdAt", tip.analytics);
};
