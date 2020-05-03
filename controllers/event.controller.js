const mongoose = require("mongoose");
const uuid = require("uuid/v4");

const CityEvent = require("../models/event.model.js");
const EventRegistration = require("../models/event-registration.model.js");
const cityController = require("./city.controller");
const meetingController = require("./meeting.controller");

// Create and Save a new event
exports.create = async (req, res) => {
  const event = new CityEvent({ ...req.body, createdBy: req.user });

  //create city for the event
  await cityController.createCityIfNotExists({
    name: event.city,
    country: event.country,
  });

  // Save event in the database
  event
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event.",
      });
    });
};

// Retrieve and return all events from the database.
exports.findAll = (req, res) => {
  let andQuery = getQuery(req.query);

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1

  CityEvent.find(finalQuery)
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Retrieve and return all events with given IDs.
exports.withIds = (req, res) => {
  const ids = req.query.ids.split(",").map((id) => mongoose.Types.ObjectId(id));
  CityEvent.find({ _id: { $in: ids } })
    .sort({ dateFrom: "ascending" })
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Retrieve and return all events from the given city.
exports.findAllInCity = (req, res) => {
  const cityName = req.params.cityName;
  const countryCode = req.params.countryCode;

  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1

  CityEvent.find({ city: cityName, country: countryCode, isPrivate: { $ne: true } })
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Retrieve and return all events from the database.
exports.findAllUpcoming = (req, res) => {
  let filter = { dateFrom: { $gte: new Date() } };
  const skill = req.query.skill;
  if (skill) {
    filter["relatedSkills"] = { $regex: skill, $options: "i" };
  }
  filter["isPrivate"] = { $ne: true };

  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1

  CityEvent.find(filter)
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Find a single event with a id
exports.findOne = (req, res) => {
  CityEvent.findById(req.params.id)
    .then((event) => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      res.send(event);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving event with id " + req.params.id,
      });
    });
};

// Update a event identified by the id in the request
exports.update = async (req, res) => {
  //create city for the event
  await cityController.createCityIfNotExists({
    name: req.body.city,
    country: req.body.country,
  });

  CityEvent.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((event) => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      res.send(event);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating event with id " + req.params.id,
      });
    });
};

// Delete a event with the specified id in the request
exports.delete = (req, res) => {
  CityEvent.findByIdAndRemove(req.params.id)
    .then((event) => {
      if (!event) {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      res.send({ message: "event deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "event not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete event with id " + req.params.id,
      });
    });
};

exports.createMeeting = async (req, res) => {
  const title = req.body.title;
  const isPrivate = req.body.isPrivate;
  const meetingId = title + "-" + uuid();
  const allowedUsers = req.body.allowedUsers || [];
  try {
    await meetingController.saveMeeting({
      title,
      eventId: req.params.id,
      createdBy: req.user,
      meetingId,
      isPrivate,
      allowedUsers,
    });
    return res.send({
      meetingId,
    });
  } catch (ex) {
    console.log(ex);
    return res.status(400).send();
  }
};

exports.updateMeeting = async (req, res) => {
  const title = req.body.title;
  const isPrivate = req.body.isPrivate;
  const meetingId = req.body.meetingId;
  const allowedUsers = req.body.allowedUsers || [];

  try {
    const updatedMeeting = await meetingController.updateMeeting(req.params.meetingId, {
      title,
      eventId: req.params.id,
      createdBy: req.user,
      meetingId,
      isPrivate,
      allowedUsers,
    });

    if (!updatedMeeting) {
      return res.status(404).send({
        message: "meeting not found with id " + req.params.meetingId
      });
    }
    return res.send({
      meetingId,
    });
  } catch (ex) {
    console.log(ex);
    return res.status(400).send();
  }
};

exports.findMeetings = async (req, res) => {
  const eventId = req.params.id;
  try {
    const meetings = await meetingController.getMeetings(eventId);
    res.send(meetings);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

exports.findPrivateMeetings = async (req, res) => {
  const eventId = req.params.id;
  try {
    const meetings = await meetingController.getPrivateMeetings(eventId, req.user);
    res.send(meetings);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

exports.registerUser = async (req, res) => {
  const eventRegistration = new EventRegistration({ ...req.body, createdBy: req.user });

  // Save eventRegistration in the database
  EventRegistration.find()
    .then((users) => {
      if (users.length == 0)
        eventRegistration
          .save()
          .then((data) => {
            res.send({ message: "Registered sucessfully." });
          })
      else {
        res.send({ message: "You've already registered for this event." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while registering user.",
      });
    });
};


// Retrieve and return all events created by the loggedIn user
exports.findMyEvent = (req, res) => {
  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1

  let andQuery = getQuery(req.query);
  andQuery.push({ 'createdBy.username': { $eq: req.user.username } })

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  CityEvent.find(finalQuery)
    .sort({ createdAt: "desc" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Retrieve and return all online events not created by the loggedIn user
exports.findUpcomingOnlineEvents = (req, res) => {
  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1
  const username = req.query.username

  let andQuery = getQuery(req.query);
  andQuery.push({ dateFrom: { $gte: new Date() } })
  andQuery.push({ isOnline: { $eq: true } })

  /** Added not equal to true as some records don't have isPrivate field */
  andQuery.push({ isPrivate: { $ne: true } })

  /** If user is loggedIn */
  if (username)
    andQuery.push({ 'createdBy.username': { $ne: username } })

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }
  CityEvent.find(finalQuery)
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

// Retrieve and return all offilne events not created by the loggedIn user
exports.findUpcomingOfflineEvents = (req, res) => {
  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1
  const username = req.query.username

  let andQuery = getQuery(req.query);
  andQuery.push({ dateFrom: { $gte: new Date() } })

  /** Added not equal to true as some records don't have isOnline field */
  andQuery.push({ isOnline: { $ne: true } })

  /** Added not equal to true as some records don't have isPrivate field  */
  andQuery.push({ isPrivate: { $ne: true } })

  /** If user is loggedIn */
  if (username)
    andQuery.push({ 'createdBy.username': { $ne: username } })

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }
  CityEvent.find(finalQuery)
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};


// Retrieve and return all past events not created by the loggedIn user
exports.findPastEvents = (req, res) => {
  const limit = Number(req.query.limit) || 100
  const page = Number(req.query.page) || 1
  const username = req.query.username

  let andQuery = getQuery(req.query);
  andQuery.push({ dateFrom: { $lt: new Date() } })

  /** Added not equal to true as some records don't have isPrivate field  */
  andQuery.push({ isPrivate: { $ne: true } })

  /** If user is loggedIn */
  if (username)
    andQuery.push({ 'createdBy.username': { $ne: username } })

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }
  CityEvent.find(finalQuery)
    .sort({ dateFrom: "ascending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};


function getQuery(query) {
  const {
    searchText,
    relatedSkills,
    city,
    country,
  } = query;

  let skillsQuery = {};
  let textQuery = {};
  let andQuery = [];

  if (searchText) {
    textQuery["$or"] = [
      { name: { $regex: searchText, $options: "i" } },
      { description: { $regex: searchText, $options: "i" } },
      { title: { $regex: searchText, $options: "i" } },
    ];
    andQuery.push(textQuery);
  }

  if (relatedSkills) {
    let skills = relatedSkills.split(",");
    if (skills.length) {
      skillsQuery["$or"] = [{ relatedSkills: { $in: skills } }];
      andQuery.push(skillsQuery);
    }
  }

  let cityQuery = [];
  if (city || country) {
    if (city) {
      cityQuery.push({ city: { $regex: city, $options: "i" } });
    }
    if (country) {
      cityQuery.push({ country: country });
    }
    let locationQuery = {
      $and: cityQuery,
    };
    andQuery.push(locationQuery);
  }

  return andQuery;
}