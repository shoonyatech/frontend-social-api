const { Logger } = require("mongodb");
const City = require("../models/city.model.js");

// Create and Save a new city
exports.create = async (req, res) => {
  const city = await this.createCityIfNotExists(req.body);
  if (city == null) {
    return res.status(404).send({
      message: `city or county code not available`,
    });
  }
  res.send(city);
};

exports.createCityIfNotExists = async (cityDetails) => {
  if (
    cityDetails.name == null ||
    cityDetails.country == null ||
    cityDetails.name === "" ||
    cityDetails.country === ""
  ) {
    return null;
  }

  const existingCity = await City.find({
    name: cityDetails.name,
    country: cityDetails.country,
  });

  if (existingCity.length) {
    console.log(existingCity);
    return existingCity[0];
  }

  // Save city in the database
  const cityModel = new City({ ...cityDetails });
  return await cityModel.save();
};

// Retrieve and return all citys from the database that matches search result.
exports.findAll = (req, res) => {
  const { citySearchText, country } = req.query;

  let orQuery = [];
  let cityName = {};
  if (citySearchText && citySearchText.length) {
    cityName["$or"] = [
      { name: { $regex: citySearchText, $options: "i" } },
      { oldName: { $regex: citySearchText, $options: "i" } },
    ];
    orQuery.push(cityName);
  }

  if (country && country.length) {
    orQuery.push({ country: country });
  }

  let finalQuery = {};
  if (orQuery.length) {
    finalQuery = { $or: orQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;

  City.find(finalQuery)
    .sort({ name: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((cities) => {
      res.send(cities);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving citys.",
      });
    });
};

// Find a single city with a id
exports.findOne = (req, res) => {
  const cityName = req.params.cityName;
  const countryCode = req.params.countryCode;
  City.findOne({ name: cityName, country: countryCode })
    .then((city) => {
      if (!city) {
        return res.status(404).send({
          message: `city not found with name ${cityName} and county code ${countryCode}`,
        });
      }
      res.send(city);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving city with id " + req.params.id,
      });
    });
};

// Update a city identified by the id in the request
exports.update = (req, res) => {
  City.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((city) => {
      if (!city) {
        return res.status(404).send({
          message: "city not found with id " + req.params.id,
        });
      }
      res.send(city);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating city with id " + req.params.id,
      });
    });
};

// Delete a city with the specified id in the request
exports.delete = (req, res) => {
  City.findByIdAndRemove(req.params.id)
    .then((city) => {
      if (!city) {
        return res.status(404).send({
          message: "city not found with id " + req.params.id,
        });
      }
      res.send({ message: "city deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "city not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete city with id " + req.params.id,
      });
    });
};
