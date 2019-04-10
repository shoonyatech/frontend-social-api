const Meetup = require("../models/meetup.model.js");

// Create and Save a new meetup
exports.create = (req, res) => {
  const meetup = new Meetup({
    name: req.body.name,
    description: req.body.description,
    dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo,
    location: req.body.location,
    relatedSkills: req.body.relatedSkills
  });

  // Save meetup in the database
  meetup
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the meetup."
      });
    });
};

// Retrieve and return all meetups from the database.
exports.findAll = (req, res) => {
  Meetup.find()
    .then(meetups => {
      res.send(meetups);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving meetups."
      });
    });
};

// Find a single meetup with a id
exports.findOne = (req, res) => {
  Meetup.findById(req.params.id)
    .then(meetup => {
      if (!meetup) {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      res.send(meetup);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving meetup with id " + req.params.id
      });
    });
};

// Update a meetup identified by the id in the request
exports.update = (req, res) => {
  Meetup.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      location: req.body.location,
      relatedSkills: req.body.relatedSkills
    },
    { new: true }
  )
    .then(meetup => {
      if (!meetup) {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      res.send(meetup);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating meetup with id " + req.params.id
      });
    });
};

// Delete a meetup with the specified id in the request
exports.delete = (req, res) => {
  Meetup.findByIdAndRemove(req.params.id)
    .then(meetup => {
      if (!meetup) {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      res.send({ message: "meetup deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "meetup not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete meetup with id " + req.params.id
      });
    });
};
