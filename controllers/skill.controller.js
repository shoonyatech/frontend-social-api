const Skill = require("../models/skill.model");

exports.create = (req, res) => {
  //need to add validation and request sanitization
  const skill = new Skill({ name: req.body.name });
  skill
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating skill."
      });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  Skill.find()
    .then(skills => {
      res.send(skills);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving skills."
      });
    });
};
