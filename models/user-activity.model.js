const mongoose = require("mongoose");

const UserActivity = mongoose.Schema(
    {
        title: String,
        pageLink: String,
        activityType: String,
        model: String,
        username: String,
        createdBy: []
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("UserActivity", UserActivity);