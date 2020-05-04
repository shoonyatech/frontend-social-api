module.exports = app => {
  const meeting = require("../controllers/meeting.controller.js");

  app.post("/meeting", meeting.createMeeting);

  app.put("/meeting/:meetingId", meeting.updateMeeting);

  app.delete("/meeting/:meetingId", meeting.deleteMeeting);
};
