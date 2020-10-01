const UserActivity = require("../models/user-activity.model.js");

// Create and Save a new user-activiy
exports.create = (req, res) => {
  const userActivity = new UserActivity({
    ...req.body,
    username: req.user.username,
    createdBy: req.user,
  });

  // Save user-activiy in the database
  userActivity
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user-activiy.",
      });
    });
};

// Retrieve and return all  user-activiy from the database by user.
exports.findAllByUser = (req, res) => {
  UserActivity.find({ username: req.params.username })
    .then((userActivities) => {
      res.send(userActivities);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving comments.",
      });
    });
};
