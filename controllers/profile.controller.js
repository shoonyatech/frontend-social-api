const Profile = require("../models/profile.model.js");

// Create and Save a new profile
exports.create = (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    profilePic: req.body.profilePic,
    email: req.body.email,
    social: req.body.social,
    skils: req.body.skils,
    confAttended: req.body.confAttended,
    confUpcoming: req.body.confUpcoming,
    meetupAttended: req.body.meetupAttended,
    meetupUpcoming: req.body.meetupUpcoming
  });

  // Save profile in the database
  profile
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the profile."
      });
    });
};

// Retrieve and return all profiles from the database.
exports.findAll = (req, res) => {
  Profile.find()
    .then(profiles => {
      res.send(profiles);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving profiles."
      });
    });
};

// Find a single profile with a id
exports.findOne = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      res.send(profile);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving profile with id " + req.params.id
      });
    });
};

// Update a profile identified by the id in the request
exports.update = (req, res) => {
  Profile.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      profilePic: req.body.profilePic,
      email: req.body.email,
      social: req.body.social,
      skils: req.body.skils,
      confAttended: req.body.confAttended,
      confUpcoming: req.body.confUpcoming,
      meetupAttended: req.body.meetupAttended,
      meetupUpcoming: req.body.meetupUpcoming
    },
    { new: true }
  )
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      res.send(profile);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating profile with id " + req.params.id
      });
    });
};

// Delete a profile with the specified id in the request
exports.delete = (req, res) => {
  Profile.findByIdAndRemove(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      res.send({ message: "profile deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "profile not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete profile with id " + req.params.id
      });
    });
};
