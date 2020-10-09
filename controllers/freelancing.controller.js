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

exports.delete = (req, res) => {
  Freelance.findOneAndDelete({ username: req.params.username })
    .then((freelancer) => {
      if (!freelancer) {
        return res.status(404).send({
          message: "freelancer not found with username " + req.params.username,
        });
      }
      res.send({ message: "freelancer deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Could not delete freelancer with username " + req.params.username,
      });
    });
};
exports.update = (req, res) => {
  Freelance.findOneAndUpdate(
    { username: req.params.username },
    {
      ...req.body,
    },
    { new: true }
  )
    .then((freelancer) => {
      if (!freelancer) {
        return res.status(404).send({
          message: "freelancer not found with id " + req.params.id,
        });
      }
      res.send(freelancer);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "freelancer not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating freelancer with id " + req.params.id,
      });
    });
};

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
  Freelance.findOne({ username: req.params.username })
    .then((freelance) => {
      if (!freelance) {
        return res.status(404).send({
          message: "freelance not found with username " + req.params.username,
        });
      }
      res.send(freelance);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "freelance not found with username " + req.params.username,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving freelance with username " + req.params.username,
      });
    });
};
exports.getAllSkills = async (req, res) => {
  try {
    const skill = await Freelance.find({});
    let skills = skill.reduce((acc, val) => {
      return acc.concat(val.relatedSkills);
    }, []);
    res.send(Array.from(new Set(skills)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};
exports.getAllCategory = async (req, res) => {
  try {
    const skill = await Freelance.find({});
    let skills = skill.reduce((acc, val) => {
      return acc.concat(val.category);
    }, []);
    res.send(Array.from(new Set(skills)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};

function getQuery(query) {
  const { relatedSkills, category } = query;

  let skillsQuery = {};
  let categoriesQuery = {};
  let andQuery = [];

  if (relatedSkills) {
    let skills = relatedSkills.split(",");
    if (skills.length) {
      skillsQuery["$or"] = [{ relatedSkills: { $in: skills } }];
      andQuery.push(skillsQuery);
    }
  }
  if (category) {
    let categories = category.split(",");
    if (categories.length) {
      categoriesQuery["$or"] = [{ category: { $in: categories } }];
      andQuery.push(categoriesQuery);
    }
  }
  return andQuery;
}
