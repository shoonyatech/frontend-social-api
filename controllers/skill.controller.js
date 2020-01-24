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

// Retrieve and return all skills from the database.
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

// Retrieve and return all frameworks from the database.
exports.findAllFrameworks = (req, res) => {
  Skill.find({ name: { $in: ["React", "Angular", "Vue", "Svelte"] } })
    .then(frameoworks => {
      res.send(frameoworks);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving frameworks."
      });
    });
};

// Delete a skill with the specified id in the request
exports.delete = (req, res) => {
  Skill.findByIdAndRemove(req.params.id)
    .then(skill => {
      if (!skill) {
        return res.status(404).send({
          message: "skill not found with id " + req.params.id
        });
      }
      res.send({ message: "skill deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "skill not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete skill with id " + req.params.id
      });
    });
};
