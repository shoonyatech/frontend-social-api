const Conference = require("../models/conference.model.js");

// Create and Save a new conference
exports.create = (req, res) => {
  const conference = new Conference({
    name: req.body.name,
    description: req.body.description,
    dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo,
    city: req.body.city,
    country: req.body.country,
    conferenceOrMeetup: req.body.conferenceOrMeetup,
    relatedSkills: req.body.relatedSkills,
    link: req.body.link
  });

  // Save conference in the database
  conference
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the conference."
      });
    });
};

// Retrieve and return all conferences from the database.
exports.findAll = (req, res) => {
  let pageNumber = parseInt(req.query.pageNo);
  let nPerPage = parseInt(req.query.itemsPerPage);

  let filterObj = {};
  if(req.query.searchText){
    filterObj['$or'] = [{name:{$regex: req.query.searchText, $options: 'i'}},
                        {description:{$regex: req.query.searchText, $options: 'i'}}];
  }
  if(req.query.relatedSkills){
    let relatedSkills = req.query.relatedSkills.split(',');
    filterObj.relatedSkills = { $in : relatedSkills };
  }
  if(req.query.city){
    filterObj.city = req.query.city
  }
  Conference.find(filterObj,['_id', 'name', 'dateFrom', 'conferenceOrMeetup','description','link'])
    .sort({'createdAt': 'descending'})
    .skip((pageNumber-1)*nPerPage).limit(nPerPage)
    .then(conferences => {
      res.send(conferences);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving conferences."
      });
    });
};

// Find a single conference with a id
exports.findOne = (req, res) => {
  Conference.findById(req.params.id)
    .then(conference => {
      if (!conference) {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      res.send(conference);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving conference with id " + req.params.id
      });
    });
};

// Update a conference identified by the id in the request
exports.update = (req, res) => {
  Conference.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      city: req.body.city,
      country: req.body.country,
      conferenceOrMeetup: req.body.conferenceOrMeetup,
      relatedSkills: req.body.relatedSkills
    },
    { new: true }
  )
    .then(conference => {
      if (!conference) {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      res.send(conference);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating conference with id " + req.params.id
      });
    });
};

// Delete a conference with the specified id in the request
exports.delete = (req, res) => {
  Conference.findByIdAndRemove(req.params.id)
    .then(conference => {
      if (!conference) {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      res.send({ message: "conference deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "conference not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete conference with id " + req.params.id
      });
    });
};
