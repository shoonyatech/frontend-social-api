const axios = require("axios");
var jwt = require("jsonwebtoken");
const User = require("../models/profile.model.js");

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find({city : req.query.city})
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving profiles."
      });
    });
};