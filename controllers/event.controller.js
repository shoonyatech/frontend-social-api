const Event = require("../models/event.model.js");

// Create and Save a new event
exports.create = (req, res) => {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo,
    city: req.body.city,
    country: req.body.country,
    eventOrMeetup: req.body.eventOrMeetup,
    relatedSkills: req.body.relatedSkills,
    link: req.body.link
  });

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
  let pageNumber = parseInt(req.query.pageNo);
  let nPerPage = parseInt(req.query.itemsPerPage);

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
  Event.find(filterObj, [
    "_id",
    "name",
    "dateFrom",
    "eventOrMeetup",
    "description",
    "link"
  ])
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

// Retrieve and return all events from the database.
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
  const reqBody = req.body;
  Event.findByIdAndUpdate(
    req.params.id,
    {
      ...reqBody
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
