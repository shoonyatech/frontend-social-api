module.exports = app => {
  const event = require("../controllers/event.controller.js");

  // Retrieve all event
  app.get("/event", event.findAll);

  // Retrieve all event
  app.get("/event/withIds", event.withIds);

  // Retrieve all event in a city
  app.get("/event/city/:cityName/:countryCode", event.findAllInCity);

  // Retrieve all event in a city
  app.get("/event/upcoming", event.findAllUpcoming);

  // Retrieve a single event with id
  app.get("/event/:id", event.findOne);

  app.get("/event/:id/meetings", event.findMeetings);

  //Retrieve all online events not created by the loggedIn user
  app.get("/event/get/upcoming/online", event.findUpcomingOnlineEvents);

  //Retrieve all offline events not created by the loggedIn user
  app.get("/event/get/upcoming/offline", event.findUpcomingOfflineEvents);

  //Retrieve all past events not created by the loggedIn user
  app.get("/event/get/past", event.findPastEvents);
};
