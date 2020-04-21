module.exports = (app) => {
    const vote = require("../controllers/vote.controller.js");

    // Check if user canVote
    app.get("/vote/canVote/:id", vote.canVote);
};
