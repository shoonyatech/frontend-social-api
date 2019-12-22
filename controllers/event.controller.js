const mongoose = require("mongoose");
const Event = require("../models/event.model.js");

// Create and Save a new event
exports.create = (req, res) => {
  const event = new Event(...req.body);

  // Save event in the database
  event
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event."
      });
    });
};

// Retrieve and return all events from the database.
exports.findAll = (req, res) => {
  let pageNumber = req.query.pageNo ? parseInt(req.query.pageNo) : 1;
  let nPerPage = req.query.itemsPerPage
    ? parseInt(req.query.itemsPerPage)
    : 200;

  let filterObj = {};
  let reqArr = [];
  let reqObj = {};
  if (req.query.searchText) {
    reqObj = { name: { $regex: req.query.searchText, $options: "i" } };
    reqArr.push(reqObj);
    reqObj = { description: { $regex: req.query.searchText, $options: "i" } };
    reqArr.push(reqObj);
  }
  if (req.query.relatedSkills) {
    let relatedSkills = req.query.relatedSkills.split(",");
    reqObj = { relatedSkills: { $in: relatedSkills } };
    reqArr.push(reqObj);
  }
  if (req.query.city) {
    reqObj = { city: { $regex: req.query.city, $options: "i" } };
    reqArr.push(reqObj);
  }
  filterObj["$or"] = reqArr;
  Event.find(filterObj)
    .sort({ createdAt: "descending" })
    .skip((pageNumber - 1) * nPerPage)
    .limit(nPerPage)
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events."
      });
    });
};

// Retrieve and return all events with given IDs.
exports.withIds = (req, res) => {
  const ids = req.query.ids.split(",").map(id => mongoose.Types.ObjectId(id));
  Event.find({ _id: { $in: ids } })
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events."
      });
    });
};

// Retrieve and return all events from the given city.
exports.findAllInCity = (req, res) => {
  const cityName = req.params.cityName;
  const countryCode = req.params.countryCode;
  Event.find({ city: cityName, country: countryCode })
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events."
      });
    });
};

// Retrieve and return all events from the database.
exports.findAllUpcoming = (req, res) => {
  Event.find({ dateFrom: { $gte: new Date() } })
    .then(events => {
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events."
      });
    });
};

// Find a single event with a id
exports.findOne = (req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      res.send(event);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving event with id " + req.params.id
      });
    });
};

// Update a event identified by the id in the request
exports.update = (req, res) => {
  Event.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body
    },
    { new: true }
  )
    .then(event => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      res.send(event);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating event with id " + req.params.id
      });
    });
};

// Delete a event with the specified id in the request
exports.delete = (req, res) => {
  Event.findByIdAndRemove(req.params.id)
    .then(event => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      res.send({ message: "event deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete event with id " + req.params.id
      });
    });
};
