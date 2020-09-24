const Article = require("../models/article.model.js");
const rewardPointsController = require("./reward-points.controller.js");
const ADD_ARTICLE_REWARD_POINTS = 50;

// Create and Save a new article
exports.create = (req, res) => {
  const article = new Article({ ...req.body, createdBy: req.user });

  // Save article in the database
  article
    .save()
    .then((data) => {
      rewardPointsController.addRewardPoints(
        req.user.username,
        ADD_ARTICLE_REWARD_POINTS,
        `For creating a new article`
      );
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the article.",
      });
    });
};

// Retrieve and return all articles from the database.
exports.findAll = (req, res) => {
  let andQuery = getQuery(req.query);

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;

  Article.find(finalQuery)
    .sort({ createdAt: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles.",
      });
    });
};

exports.analytics = (req, res) => {
  const createdAt = req.params.createdAt;
  Article.find({
    createdAt: {
      $gte: `${createdAt} 00:00:00.507Z`,
      $lt: `${createdAt} 23:59:59.507Z`,
    },
  })
    .then((article) => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with createdAt " + createdAt,
        });
      }
      res.send(article);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "article not found with createdAt " + createdAt,
        });
      }
      return res.status(500).send({
        message: "Error retrieving article with articlename " + title,
      });
    });
};

// Find a single article with a id
exports.findOne = (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      res.send(article);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving article with id " + req.params.id,
      });
    });
};

// Update a article identified by the id in the request
exports.update = (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      url: req.body.url,
      courtesy: req.body.courtesy,
      courtesyUrl: req.body.courtesyUrl,
      tags: req.body.tags,
      medium: req.body.medium,
      type: req.body.type,
    },
    { new: true }
  )
    .then((article) => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      res.send(article);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating article with id " + req.params.id,
      });
    });
};

// Delete a article with the specified id in the request
exports.delete = (req, res) => {
  Article.findByIdAndRemove(req.params.id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      res.send({ message: "article deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete article with id " + req.params.id,
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
