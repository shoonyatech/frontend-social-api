const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cityController = require("./city.controller");
const { JWT_SECRET } = process.env;
// Create and Save a new user
exports.findSocialAuthUserinDB = async (provider, user, res, authResponse) => {
  let name, profilePic, email;

  if (provider === "facebook") {
    name = user.name;
    profilePic = user.picture.data.url;
    email = user.email;
  } else if (provider === "github") {
    name = user.name || user.login;
    profilePic = user.avatar_url;
    email = user.email;
  } else if (provider === "twitter") {
    name = user.name;
    profilePic = user.profile_image_url_https;
    email = null;
  }

  User.find({ socialId: user.id, provider: provider })
    .then(existingUser => {
      if (existingUser == null || !existingUser.length) {
        //user not found. Create one
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

      const authToken = jwt.sign(
        { email, username: existingUser[0].username },
        JWT_SECRET
      );
      const account = { ...authResponse, authToken, ...existingUser[0]._doc };
      res.send(account);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        message: "Error retrieving user with " + provider + " id " + user.id
      });
    });
};

async function createUniqueUsername(name) {
  let alreadyExists = true;
  let username = "";
  let counter = 0;
  while (alreadyExists) {
    username =
      name.replace(" ", "").toLowerCase() +
      (counter === 0 ? "" : counter.toString());
    let existingUser = await User.findOne({ username: username });
    alreadyExists = existingUser != null;
    counter++;
  }
  return username;
}

async function createSocialAuthUser(
  name,
  profilePic,
  email,
  provider,
  socialId,
  res,
  authResponse
) {
  const username = await createUniqueUsername(name);
  const authToken = jwt.sign({ email, username }, JWT_SECRET);

  const user = new User({
    name,
    username,
    category: "dev",
    profilePic,
    email,
    social: [
      { label: "Github", value: "" },
      { label: "Twitter", value: "" },
      { label: "LinkedIn", value: "" },
      { label: "Bitbucket", value: "" },
      { label: "Medium", value: "" },
      { label: "Website", value: "" },
      { label: "Stack Overflow", value: "" }
    ],
    skills: [
      { name: "JS", noOfYears: 0, rating: 0 },
      { name: "HTML5", noOfYears: 0, rating: 0 },
      { name: "CSS", noOfYears: 0, rating: 0 },
      { name: "React", noOfYears: 0, rating: 0 },
      { name: "Angular", noOfYears: 0, rating: 0 },
      { name: "Vue", noOfYears: 0, rating: 0 },
      { name: "Web Components", noOfYears: 0, rating: 0 },
      { name: "Website Design", noOfYears: 0, rating: 0 },
      { name: "Android", noOfYears: 0, rating: 0 },
      { name: "iOS", noOfYears: 0, rating: 0 }
    ],
    eventIds: [],
    socialId,
    provider,
    city: null,
    country: null
  });

  // Save user in the database
  try {
    const userModel = await user.save();
    const account = { ...authResponse, authToken, ...userModel._doc };
    res.send(account);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the user."
    });
  }
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
  const username = req.user.username;
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with username " + username
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with username " + username
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with username " + username
      });
    });
};

// Update user of logged in user
exports.update = async (req, res) => {
  const username = req.user.username;

  try {
    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(404).send({
        message: "user not found with email " + username
      });
    }
    const userId = existingUser.id;

    if (req.user.username !== req.body.username) {
      const userWithNewUsername = await User.findOne({
        username: req.body.username
      });
      if (userWithNewUsername != null && userWithNewUsername.id != userId) {
        return res.status(500).send({
          message: "user with username " + req.body.username + " already exists"
        });
      }
    }

    //create city for the user
    await cityController.createCityIfNotExists({
      name: req.body.city,
      country: req.body.country
    });

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...req.body
        },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).send({
          message: "user not found with id " + userId
        });
      }

      res.send(updatedUser);
    } catch (err) {
      console.log(err);
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with id " + userId
        });
      }
      return res.status(500).send({
        message: "Error updating user with id " + userId
      });
    }
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "user not found with email " + username
      });
    }
    return res.status(500).send({
      message: "Error retrieving user with email " + username
    });
  }
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

exports.findByUsername = (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with username " + username
        });
      }
      res.send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with username " + username
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with username " + username
      });
    });
};

exports.findUsersInCity = (req, res) => {
  const cityName = req.params.cityName;
  const countryCode = req.params.countryCode;
  User.find({ city: cityName, country: countryCode })
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};
