const Tool = require("../models/tool.model.js");

// Create and Save a new tool
exports.create = (req, res) => {
  const tool = new Tool({ ...req.body, createdBy: req.user });

  // Save tool in the database
  tool
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the tool.",
      });
    });
};

// Retrieve and return all tools from the database.
exports.findAll = (req, res) => {

  const {
    relatedSkills
  } = req.query;

  let skillsQuery = {};
  let andQuery = [];

  if (relatedSkills) {
    let skills = relatedSkills.split(",");
    if (skills.length) {
      skillsQuery["$or"] = [{ technologies: { $in: skills } }];
      andQuery.push(skillsQuery);
    }
  }

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1

  Tool.find(finalQuery)
    .limit(limit)
    .skip(limit * (page - 1))
    .then((tools) => {
      res.send(tools);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};

// Find a single tool with a id
exports.findOne = (req, res) => {
  Tool.findById(req.params.id)
    .then((tool) => {
      if (!tool) {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      res.send(tool);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving tool with id " + req.params.id,
      });
    });
};

// Update a tool identified by the id in the request
exports.update = (req, res) => {
  Tool.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      upRating: req.body.upRating,
      downRating: req.body.downRating,
      review: req.body.review,
      screenshot: req.body.screenshot,
      technologies: req.body.technologies,
    },
    { new: true }
  )
    .then((tool) => {
      if (!tool) {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      res.send(tool);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating tool with id " + req.params.id,
      });
    });
};

// Delete a tool with the specified id in the request
exports.delete = (req, res) => {
  Tool.findByIdAndRemove(req.params.id)
    .then((tool) => {
      if (!tool) {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      res.send({ message: "tool deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "tool not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete tool with id " + req.params.id,
      });
    });
};
