module.exports = app => {
  const meeting = require("../controllers/meeting.controller.js");

  app.get("/meetings", meeting.findMeetings);
};
