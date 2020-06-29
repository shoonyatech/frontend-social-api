module.exports = app => {
  const vLog = require("../controllers/vlog.controller.js");

  app.post("/vlog", vLog.create);

  app.put("/vlog/:id", vLog.update);

  app.delete("/vlog/:id", vLog.delete);
};
