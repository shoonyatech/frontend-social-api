const City = require("../models/city.model.js");

// Create and Save a new city
exports.create = (req, res) => {
  const city = new City({
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    country: req.body.country,
    lat: req.body.lat,
    lng: req.body.lng
  });

  // Save city in the database
  city
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the city."
      });
    });
};

// Retrieve and return all citys from the database.
exports.findAll = (req, res) => {
  City.find()
    .then(citys => {
      res.send(citys);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving citys."
      });
    });
};

// Find a single city with a id
exports.findOne = (req, res) => {
  City.findById(req.params.id)
    .then(city => {
      if (!city) {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      res.send(city);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving city with id " + req.params.id
      });
    });
};

// Update a city identified by the id in the request
exports.update = (req, res) => {
  City.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      photo: req.body.photo,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng
    },
    { new: true }
  )
    .then(city => {
      if (!city) {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      res.send(city);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating city with id " + req.params.id
      });
    });
};

// Delete a city with the specified id in the request
exports.delete = (req, res) => {
  City.findByIdAndRemove(req.params.id)
    .then(city => {
      if (!city) {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      res.send({ message: "city deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete city with id " + req.params.id
      });
    });
};
