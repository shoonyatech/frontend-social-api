const Article = require("../models/article.model.js");

// Create and Save a new article
exports.create = (req, res) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    details: req.body.details,
    url: req.body.url,
    courtesy: req.body.courtesy,
    courtesyUrl: req.body.courtesyUrl,
    tags: req.body.tags,
    medium: req.body.medium,
    type: req.body.type
  });

  // Save article in the database
  article
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the article."
      });
    });
};

// Retrieve and return all articles from the database.
exports.findAll = (req, res) => {
  let filterObj = {};
  let reqObj = {};
  if (req.query.tags) {
    let tags = req.query.tags.split(",");
    reqObj = { tags: { $in: tags } };
    reqArr.push(reqObj);
  }
  if (req.query.medium) {
    reqObj = { medium: req.query.medium };
    reqArr.push(reqObj);
  }
  if (req.query.skill) {
    reqObj = { relatedSkill: { $regex: req.query.skill, $options: "i" } };
    reqArr.push(reqObj);
  }
  Article.find(filterObj)
    .sort({ createdAt: "descending" })
    .then(articles => {
      res.send(articles);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving articles."
      });
    });
};

// Find a single article with a id
exports.findOne = (req, res) => {
  Article.findById(req.params.id)
    .then(article => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      res.send(article);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving article with id " + req.params.id
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
      details: req.body.details,
      url: req.body.url,
      courtesy: req.body.courtesy,
      courtesyUrl: req.body.courtesyUrl,
      tags: req.body.tags,
      medium: req.body.medium,
      type: req.body.type
    },
    { new: true }
  )
    .then(article => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      res.send(article);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating article with id " + req.params.id
      });
    });
};

// Delete a article with the specified id in the request
exports.delete = (req, res) => {
  Article.findByIdAndRemove(req.params.id)
    .then(article => {
      if (!article) {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      res.send({ message: "article deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "article not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete article with id " + req.params.id
      });
    });
};
