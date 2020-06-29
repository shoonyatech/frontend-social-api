module.exports = app => {
  const vLog = require("../controllers/vlog.controller.js");

  app.get("/vlog", vLog.findAll);

  app.get("/vlog/:id", vLog.findById);
};
