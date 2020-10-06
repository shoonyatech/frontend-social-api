const Freelance = require("../models/freelancing.model.js");

exports.create = (req, res) => {
  const freelance = new Freelance({
    ...req.body,
    username: req.user.username,
    createdBy: req.user,
  });

  // Save freelancer in the database
  freelance
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the freelancer.",
      });
    });
};

exports.delete = (req, res) => {};
exports.update = (req, res) => {};

// Retrieve and return all freelancers from the database.
exports.findAll = (req, res) => {
  let andQuery = getQuery(req.query);

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  Freelance.find(finalQuery)
    .sort({ dateFrom: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((freelancers) => {
      res.send(freelancers);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving freelancers.",
      });
    });
};

// Find a single freelance with a id
exports.findOne = (req, res) => {
  Freelance.findById(req.params.id)
    .then((freelance) => {
      if (!freelance) {
        return res.status(404).send({
          message: "freelance not found with id " + req.params.id,
        });
      }
      res.send(freelance);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "freelance not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving freelance with id " + req.params.id,
      });
    });
};

function getQuery(query) {
  const { searchText, relatedSkills } = query;

  let skillsQuery = {};
  let textQuery = {};
  let andQuery = [];

  if (searchText) {
    textQuery["$or"] = [
      { name: { $regex: searchText, $options: "i" } },
      { description: { $regex: searchText, $options: "i" } },
      { title: { $regex: searchText, $options: "i" } },
    ];
    andQuery.push(textQuery);
  }

  if (relatedSkills) {
    let skills = relatedSkills.split(",");
    if (skills.length) {
      skillsQuery["$or"] = [{ relatedSkills: { $in: skills } }];
      andQuery.push(skillsQuery);
    }
  }

  return andQuery;
}
