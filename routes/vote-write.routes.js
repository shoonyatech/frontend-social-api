module.exports = (app) => {
    const vote = require("../controllers/vote.controller.js");

    // Create a new vote
    app.post("/vote", vote.create);
  };
  