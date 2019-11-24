const axios = require("axios");
var jwt = require("jsonwebtoken");
const Profile = require("../models/profile.model.js");
var config = require("../config/config").config;
var OAuth = require("oauth");
var timestamp = require("unix-timestamp");
var oauthSignature = require("oauth-signature");

// Create and Save a new user
exports.fbSignin = (req, res) => {
  axios
    .post(
      "https://graph.facebook.com/v5.0/oauth/access_token",
      {
        client_id: config.auth.facebook.clientId,
        client_secret: config.auth.facebook.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri
      },
      { "Content-Type": "application/json" }
    )
    .then(function(response) {
      var responseJson = response.data;
      res.json(responseJson);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({});
    });
};

function parseQueryString(str) {
  let obj = {};
  let key;
  let value;
  (str || "").split("&").forEach(keyValue => {
    if (keyValue) {
      value = keyValue.split("=");
      key = decodeURIComponent(value[0]);
      obj[key] = !!value[1] ? decodeURIComponent(value[1]) : true;
    }
  });
  return obj;
}

exports.githubSignin = (req, res) => {
  console.log("Attempting Github login");
  axios
    .post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.auth.github.clientId,
        client_secret: config.auth.github.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri,
        state: req.body.state,
        grant_type: "authorization_code"
      },
      { "Content-Type": "application/json" }
    )
    .then(function(response) {
      var responseJson = parseQueryString(response.data);
      if (responseJson.error) {
        res.status(500).json({ error: responseJson.error });
      } else {
        res.json(responseJson);
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
};

oauthService = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  config.auth.twitter.clientId,
  config.auth.twitter.clientSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
);

exports.twitterSignin = (req, res) => {
  console.log("Attempting Twitter login");
  if (!req.body.oauth_token) {
    oauthService.getOAuthRequestToken(
      { oauth_callback: req.body.redirectUri },
      function(error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json({
            oauth_token: oauthToken,
            oauth_token_secret: oauthTokenSecret
          });
        }
      }
    );
  } else {
    oauthService.getOAuthAccessToken(
      req.body.oauth_token,
      null,
      req.body.oauth_verifier,
      function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          res.status(500).json(error);
        } else {
          var verifyCredentialsUrl =
            "https://api.twitter.com/1.1/account/verify_credentials.json";
          var parameters = {
            oauth_consumer_key: config.auth.twitter.clientId,
            oauth_token: oauthAccessToken,
            oauth_nonce: "vueauth-" + new Date().getTime(),
            oauth_timestamp: timestamp.now(),
            oauth_signature_method: "HMAC-SHA1",
            oauth_version: "1.0"
          };

          var signature = oauthSignature.generate(
            "GET",
            verifyCredentialsUrl,
            parameters,
            config.auth.twitter.clientSecret,
            oauthAccessTokenSecret
          );

          axios
            .get(
              "https://api.twitter.com/1.1/account/verify_credentials.json",
              {
                headers: {
                  Authorization:
                    "OAuth " +
                    'oauth_consumer_key="' +
                    config.auth.twitter.clientId +
                    '",' +
                    'oauth_token="' +
                    oauthAccessToken +
                    '",' +
                    'oauth_nonce="' +
                    parameters.oauth_nonce +
                    '",' +
                    'oauth_timestamp="' +
                    parameters.oauth_timestamp +
                    '",' +
                    'oauth_signature_method="HMAC-SHA1",' +
                    'oauth_version="1.0",' +
                    'oauth_signature="' +
                    signature +
                    '"'
                }
              }
            )
            .then(function(response) {
              res.json({
                access_token: oauthAccessToken,
                access_token_secret: oauthAccessTokenSecret,

                profile: response.data
              });
            })
            .catch(function(err) {
              console.log(err.response.data.errors);
              res.status(500).json(err.response.data.errors);
            });
        }
      }
    );
  }
};

function findUserinDB(fbUser, res) {
  Profile.findOne({ fbId: fbUser.id })
    .then(profile => {
      if (profile == null || !profile.length) {
        //profile not found. Create one
        return createFBUser(fbUser, res);
      }
      res.send(profile);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        message: "Error retrieving user with fb id " + fbUser.id
      });
    });
}

function createFBUser(fbUser, res) {
  var token = jwt.sign({ email: fbUser.email }, config.auth.jwtSecret);

  const profile = new Profile({
    name: fbUser.name,
    profilePic: fbUser.picture.data.url,
    email: fbUser.email,
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
    fbId: fbUser.id,
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
