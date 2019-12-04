const axios = require("axios");
var jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find({ city: req.query.city }, [
    "_id",
    "name",
    "profilePic",
    "role",
    "skills"
  ])
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Create and Save a new job
exports.create = (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    profilePic: req.body.profilePic,
    email: req.body.email,
    social: req.body.social,
    skills: req.body.skills,
    confAttended: [req.body.confAttended], // id of conference
    confUpcoming: [req.body.confUpcoming],
    meetupAttended: [req.body.meetupAttended],
    meetupUpcoming: [req.body.meetupUpcoming],
    fbId: req.body.fbId,
    authToken: req.body.authToken,
    role: req.body.role,
    city: req.body.city
  });

  console.log("user chema ===>>", user);
  // Save job in the database
  user
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
};
