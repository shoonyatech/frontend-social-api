const Job = require("../models/job.model.js");
const { getAppliedFilters } = require("../utils/helperMethods");
const { filterTypes, jobTypeIds } = require("../utils/constants");

exports.create = (req, res) => {
  //need to add validation and request sanitization
  const job = new Job(req.body);
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

const getJobTypeKey = id => {
  const { CONTRACT, PERMANENT, PART_TIME, FULL_TIME } = jobTypeIds;
  let defaultId;
  switch (id) {
    case CONTRACT:
      return "isContract";
    case PERMANENT:
      return "isPermanent";
    case PART_TIME:
      return "isPartTime";
    case FULL_TIME:
      return "isFullTime";
    default:
      return defaultId;
  }
};

const getJobTypesQuery = (jobFilter = []) => {
  let query = [];
  jobFilter.forEach(({ id, selected }) => {
    if (selected) {
      let jobQuery = {};
      const jobKey = getJobTypeKey(id);
      jobQuery[jobKey] = true;
      query.push(jobQuery);
    }
  });
  return query;
};

// Retrieve and return all jobs from the database.
exports.findAll = (req, res) => {
  const {
    pageNo = 1,
    itemsPerPage = 20,
    searchText,
    skills = "",
    jobTypes = "",
    level
  } = req.query;
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
  let skillsQuery = {};
  let textQuery = {};
  let filterObj = {};
  let reqArr = [];
  if (searchText) {
    textQuery["$or"] = [
      { title: { $regex: searchText, $options: "i" } },
      { description: { $regex: searchText, $options: "i" } }
    ];
    reqArr.push(textQuery);
  }
  if (skills) {
    let requiredSkills = skills.split(",");
    if (requiredSkills.length) {
      skillsQuery["$or"] = [{ skills: { $in: requiredSkills } }];
      reqArr.push(skillsQuery);
    }
  }
  const jobTypesQuery = getJobTypesQuery(jobFilter);
  if (jobTypesQuery.length) {
    reqArr = reqArr.concat(jobTypesQuery);
  }
  if (level > -1) {
    reqArr.push({ level });
  }
  if (reqArr.length) {
    filterObj["$and"] = reqArr;
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
