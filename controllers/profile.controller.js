var jwt = require("jsonwebtoken");
const User = require("../models/user.model");
var config = require("../config/config").config;

// Create and Save a new user
exports.findSocialAuthUserinDB = (provider, user, res, authResponse) => {
  User.find({ socialId: user.id, provider: provider })
    .then(existingUser => {
      if (existingUser == null || !existingUser.length) {
        //user not found. Create one
        let name, profilePic, email;

        console.log(user);
        if (provider === "facebook") {
          name = user.name;
          profilePic = user.picture.data.url;
          email = user.email;
        } else if (provider === "github") {
          name = user.name;
          profilePic = user.avatar_url;
          email = user.email;
        } else if (provider === "twitter") {
          console.log(user);
          name = authResponse.user.name;
          profilePic = authResponse.user.user_image_url_https;
          email = authResponse.user.screen_name;
        }

        return createSocialAuthUser(
          name,
          profilePic,
          email,
          provider,
          user.id,
          res,
          authResponse
        );
      }
      const account = { ...authResponse, ...existingUser[0]._doc };
      res.send(account);
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
  res,
  authResponse
) {
  var token = jwt.sign({ email: email }, config.auth.jwtSecret);

  const user = new User({
    name,
    profilePic,
    email,
    social: [
      { label: "Github", value: "" },
      { label: "Twitter", value: "" },
      { label: "LinkedIn", value: "" },
      { label: "Bitbucket", value: "" },
      { label: "Medium", value: "" },
      { label: "Website", value: "" }
    ],
    skills: [],
    conferences: [],
    meetups: [],
    socialId,
    provider,
    authToken: token
  });

  // Save user in the database
  return user
    .save()
    .then(data => {
      const account = { ...authResponse, ...data._doc };
      res.send(account);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
}

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single user with a id
exports.findOne = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.id
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.id
      });
    });
};

exports.me = (req, res) => {
  const email = req.user.email;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with email " + email
      });
    });
};

// Update user of logged in user
exports.update = (req, res) => {
  const email = req.user.email;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      const userId = user.id;

      User.findByIdAndUpdate(
        userId,
        {
          name: req.body.name,
          profilePic: req.body.profilePic,
          social: req.body.social,
          skills: req.body.skills,
          conferences: req.body.conferences,
          meetups: req.body.meetups,
          city: req.body.city
        },
        { new: true }
      )
        .then(updatedUser => {
          if (!updatedUser) {
            return res.status(404).send({
              message: "user not found with id " + userId
            });
          }
          res.send(updatedUser);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "user not found with id " + userId
            });
          }
          return res.status(500).send({
            message: "Error updating user with id " + userId
          });
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with email " + email
      });
    });
};

// Delete a user for logged in user
exports.delete = (req, res) => {
  const email = req.user.email;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      const userId = user.id;

      User.findByIdAndRemove(userId)
        .then(user => {
          if (!user) {
            return res.status(404).send({
              message: "user not found with id " + userId
            });
          }
          res.send({ message: "user deleted successfully!" });
        })
        .catch(err => {
          if (err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({
              message: "user not found with id " + userId
            });
          }
          return res.status(500).send({
            message: "Could not delete user with id " + userId
          });
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with email " + email
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with email " + email
      });
    });
};
