const Job = require("../models/job.model.js");

// Create and Save a new job
exports.create = (req, res) => {
  const job = new Job({
    title: req.body.title,
    description: req.body.description,
    skils: req.body.skils,
    company: req.body.company,
    city: req.body.city,
    isFullTime: req.body.isFullTime,
    isPartTime: req.body.isPartTime,
    isRemote: req.body.isRemote,
    isPermanent: req.body.isPermanent,
    isContract: req.body.isContract,
    level: req.body.level,
    tags: req.body.tags,
    link: req.body.link
  });

  // Save job in the database
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
  let pageNumber = parseInt(req.query.pageNo);
  let nPerPage = parseInt(req.query.itemsPerPage);

  let filterObj = {};
  let reqArr = [];
  let reqObj = {};
  if(req.query.searchText){
    reqObj = {title:{$regex: req.query.searchText, $options: 'i'}};
    reqArr.push(reqObj);

    reqObj = {description:{$regex: req.query.searchText, $options: 'i'}};
    reqArr.push(reqObj);
  }
  if(req.query.skills){
    let skills = req.query.skills.split(',');
    reqObj = {skils: { $in : skills }};
    reqArr.push(reqObj);
  }
  if(req.query.isFullTime){
    reqObj = {isFullTime: req.query.isFullTime};
    reqArr.push(reqObj);
  }
  if(req.query.isPartTime){
    reqObj = {isPartTime: req.query.isPartTime};
    reqArr.push(reqObj);
  }
  if(req.query.isRemote){
    reqObj = {isRemote: req.query.isRemote};
    reqArr.push(reqObj);
  }
  if(req.query.isContract){
    reqObj = {isContract: req.query.isContract};
    reqArr.push(reqObj);
  }
  if(req.query.level){
    reqObj = {level: req.query.level};
    reqArr.push(reqObj);
  }
  filterObj['$or'] = reqArr;
  Job.find(filterObj).sort({'createdAt': 'descending'}).skip((pageNumber-1)*nPerPage).limit(nPerPage)
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
      title: req.body.title,
      description: req.body.description,
      skils: req.body.skils,
      company: req.body.company,
      city: req.body.city,
      isFullTime: req.body.isFullTime,
      isPartTime: req.body.isPartTime,
      isRemote: req.body.isRemote,
      isPermanent: req.body.isPermanent,
      isContract: req.body.isContract,
      level: req.body.level,
      tags: req.body.tags,
      link: req.body.link
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
