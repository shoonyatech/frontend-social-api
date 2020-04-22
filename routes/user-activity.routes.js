module.exports = (app) => {
    const userActivity = require("../controllers/user-activity.controller.js");

    // Get User Activity
    app.get("/useractivity", userActivity.findAllByUser);

    // Create a new useractivity
    app.post("/useractivity", userActivity.create);
};
