const Podcast = require("../models/podcast.model.js");
const { getAppliedFilters } = require("../utils/helperMethods");
const { filterTypes } = require("../utils/constants");
const { getExplicitFilters } = require("../utils/jobUtils");

exports.create = (req, res) => {
  const podcast = new Podcast({ ...req.body, createdBy: req.user });
  podcast
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the podcast.",
      });
    });
};
exports.findAll = (req, res) => {
  const { pageNo = 1, itemsPerPage = 20, searchText, skills = "" } = req.query;
  let filterObj = {};

  const skillFilter = getAppliedFilters(skills, filterTypes.SKILL);
  const response = {
    results: [],
    meta: { filters: { skills: skillFilter } },
  };

  const explicitFilters = getExplicitFilters({
    searchText,
    skills,
  });
  if (explicitFilters.length) {
    filterObj = {
      $and: explicitFilters,
    };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  Podcast.find(filterObj)
    .sort({ createdAt: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((podcasts) => {
      if (podcasts.length) {
        response.results = podcasts;
      }
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving podcasts.",
      });
    });
};

exports.findOne = (req, res) => {
  Podcast.findById(req.params.id)
    .then((podcast) => {
      if (!podcast) {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      res.send(podcast);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving podcast with id " + req.params.id,
      });
    });
};
exports.update = (req, res) => {
  Podcast.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((podcast) => {
      if (!podcast) {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      res.send(podcast);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating podcast with id " + req.params.id,
      });
    });
};
exports.delete = (req, res) => {
  Podcast.findByIdAndRemove(req.params.id)
    .then((podcast) => {
      if (!podcast) {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      res.send({ message: "podcast deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "podcast not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete podcast with id " + req.params.id,
      });
    });
};
