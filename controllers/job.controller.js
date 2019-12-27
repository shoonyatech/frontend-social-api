const Job = require("../models/job.model.js");

exports.create = (req, res) => {
  //need to add validation and request sanitization
  const job = new Job(...req.body);
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
    pageNo,
    itemsPerPage,
    searchText,
    skills,
    isFullTime,
    isPartTime,
    isRemote,
    isContract,
    level
  } = req.query;
  let pageNumber = parseInt(pageNo);
  let nPerPage = parseInt(itemsPerPage);

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
  if (isFullTime) {
    reqArr.push({ isFullTime });
  }
  if (isPartTime) {
    reqArr.push({ isPartTime });
  }
  if (isRemote) {
    reqArr.push({ isRemote });
  }
  if (isContract) {
    reqArr.push({ isContract });
  }
  if (level) {
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
      res.send(jobs);
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
