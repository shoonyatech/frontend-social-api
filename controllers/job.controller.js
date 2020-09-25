const Job = require("../models/job.model.js");
const { getAppliedFilters } = require("../utils/helperMethods");
const { filterTypes } = require("../utils/constants");
const { getExplicitFilters } = require("../utils/jobUtils");
const cityController = require("./city.controller");

exports.create = async (req, res) => {
  //need to add validation and request sanitization
  const job = new Job({ ...req.body, createdBy: req.user });

  await cityController.createCityIfNotExists({
    name: job.city,
    country: job.country,
  });

  job
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the job.",
      });
    });
};

exports.analytics = (req, res) => {
  if (req.user.admin) {
    const createdAt = req.params.createdAt;
    Job.find({
      createdAt: {
        $gte: `${createdAt} 00:00:00.000Z`,
        $lt: `${createdAt} 23:59:59.999Z`,
      },
    })
      .then((job) => {
        if (!job) {
          return res.status(404).send({
            message: "job not found with createdAt " + createdAt,
          });
        }
        res.send(job);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "job not found with createdAt " + createdAt,
          });
        }
        return res.status(500).send({
          message: "Error retrieving job with jobname " + title,
        });
      });
  } else {
    return res.status(403).send({
      message: "Error retrieving job with username " + req.user.username,
    });
  }
};

// Retrieve and return all jobs from the database.
exports.findAll = (req, res) => {
  const {
    pageNo = 1,
    itemsPerPage = 20,
    searchText,
    skills = "",
    jobTypes = "",
    level,
    city = "",
    country = "",
  } = req.query;
  let filterObj = {};

  const jobFilter = getAppliedFilters(jobTypes, filterTypes.JOB);
  const skillFilter = getAppliedFilters(skills, filterTypes.SKILL);
  const response = {
    results: [],
    meta: { filters: { jobTypes: jobFilter, skills: skillFilter } },
  };

  const explicitFilters = getExplicitFilters({
    searchText,
    skills,
    jobFilter,
    city,
    country,
    level,
  });
  if (explicitFilters.length) {
    filterObj = {
      $and: explicitFilters,
    };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  Job.find(filterObj)
    .sort({ createdAt: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((jobs) => {
      if (jobs.length) {
        response.results = jobs;
      }
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jobs.",
      });
    });
};

// Find a single job with a id
exports.findOne = (req, res) => {
  Job.findById(req.params.id)
    .then((job) => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      res.send(job);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving job with id " + req.params.id,
      });
    });
};

// Update a job identified by the id in the request
exports.update = (req, res) => {
  Job.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((job) => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      res.send(job);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating job with id " + req.params.id,
      });
    });
};

// Delete a job with the specified id in the request
exports.delete = (req, res) => {
  Job.findByIdAndRemove(req.params.id)
    .then((job) => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      res.send({ message: "job deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete job with id " + req.params.id,
      });
    });
};
