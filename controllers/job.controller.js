const Job = require("../models/job.model.js");
const { getAppliedFilters } = require("../utils/helperMethods");
const { filterTypes } = require("../utils/constants");
const { getExplicitFilters } = require("../utils/jobUtils");

exports.create = (req, res) => {
  //need to add validation and request sanitization
  const job = new Job({ ...req.body, createdBy: req.user });

  job
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the job."
      });
    });
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
    country = ""
  } = req.query;
  let filterObj = {};
  let pageNumber = parseInt(pageNo);
  let nPerPage = parseInt(itemsPerPage);
  const pagination = {
    currentPage: pageNumber,
    totalPages: 5,
    count: 100
  };
  const jobFilter = getAppliedFilters(jobTypes, filterTypes.JOB);
  const skillFilter = getAppliedFilters(skills, filterTypes.SKILL);
  const response = {
    results: [],
    meta: { pagination, filters: { jobTypes: jobFilter, skills: skillFilter } }
  };

  const explicitFilters = getExplicitFilters({
    searchText,
    skills,
    jobFilter,
    city,
    country,
    level
  });
  if (explicitFilters.length) {
    filterObj = {
      $and: explicitFilters
    };
  }

  Job.find(filterObj)
    .sort({ createdAt: "descending" })
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage)
    .then(jobs => {
      if (jobs.length) {
        response.results = jobs;
      }
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jobs."
      });
    });
};

// Find a single job with a id
exports.findOne = (req, res) => {
  Job.findById(req.params.id)
    .then(job => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      res.send(job);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving job with id " + req.params.id
      });
    });
};

// Update a job identified by the id in the request
exports.update = (req, res) => {
  Job.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body
    },
    { new: true }
  )
    .then(job => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      res.send(job);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating job with id " + req.params.id
      });
    });
};

// Delete a job with the specified id in the request
exports.delete = (req, res) => {
  Job.findByIdAndRemove(req.params.id)
    .then(job => {
      if (!job) {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      res.send({ message: "job deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "job not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete job with id " + req.params.id
      });
    });
};
