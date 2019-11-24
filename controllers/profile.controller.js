var jwt = require("jsonwebtoken");
const Profile = require("../models/profile.model.js");
var config = require("../config/config").config;

// Create and Save a new user
exports.findSocialAuthUserinDB = (provider, user, res) => {
  Profile.findOne({ socialId: user.id })
    .then(profile => {
      if (profile == null || !profile.length) {
        //profile not found. Create one
        let name, profilePic, email;

        if (provider === "facebook") {
          name = user.name;
          profilePic = user.picture.data.url;
          email = user.email;
        }

        return createSocialAuthUser(
          name,
          profilePic,
          email,
          provider,
          user.id,
          res
        );
      }
      res.send(profile);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        message: "Error retrieving user with fb id " + user.id
      });
    });
};

function createSocialAuthUser(
  name,
  profilePic,
  email,
  provider,
  socialId,
  res
) {
  var token = jwt.sign({ email: email }, config.auth.jwtSecret);

  const profile = new Profile({
    name: name,
    profilePic: profilePic,
    email: email,
    social: [
      { label: "Github", value: "" },
      { label: "Twitter", value: "" },
      { label: "LinkedIn", value: "" },
      { label: "Bitbucket", value: "" },
      { label: "Medium", value: "" },
      { label: "Website", value: "" }
    ],
    skills: [],
    confAttended: [],
    confUpcoming: [],
    meetupAttended: [],
    meetupUpcoming: [],
    socialId: socialId,
    provider: provider,
    authToken: token
  });

  // Save profile in the database
  return profile
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
}

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

exports.me = (req, res) => {
  const email = req.user.email;
  Profile.findOne({ email: email })
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      res.send(profile);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving profile with email " + email
      });
    });
};

// Update profile of logged in user
exports.update = (req, res) => {
  const email = req.user.email;
  Profile.findOne({ email: email })
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      const profileId = profile.id;

      Profile.findByIdAndUpdate(
        profileId,
        {
          name: req.body.name,
          profilePic: req.body.profilePic,
          social: req.body.social,
          skills: req.body.skills,
          confAttended: req.body.confAttended,
          confUpcoming: req.body.confUpcoming,
          meetupAttended: req.body.meetupAttended,
          meetupUpcoming: req.body.meetupUpcoming
        },
        { new: false }
      )
        .then(updatedProfile => {
          if (!updatedProfile) {
            return res.status(404).send({
              message: "profile not found with id " + profileId
            });
          }
          res.send(updatedProfile);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "profile not found with id " + profileId
            });
          }
          return res.status(500).send({
            message: "Error updating profile with id " + profileId
          });
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving profile with email " + email
      });
    });
};

// Delete a profile for logged in user
exports.delete = (req, res) => {
  const email = req.user.email;

  Profile.findOne({ email: email })
    .then(profile => {
      if (!profile) {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      const profileId = profile.id;

      Profile.findByIdAndRemove(profileId)
        .then(profile => {
          if (!profile) {
            return res.status(404).send({
              message: "profile not found with id " + profileId
            });
          }
          res.send({ message: "profile deleted successfully!" });
        })
        .catch(err => {
          if (err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({
              message: "profile not found with id " + profileId
            });
          }
          return res.status(500).send({
            message: "Could not delete profile with id " + profileId
          });
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "profile not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving profile with email " + email
      });
    });
};
