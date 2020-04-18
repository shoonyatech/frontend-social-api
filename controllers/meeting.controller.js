const Meeting = require("../models/meetings.model.js");

exports.saveMeeting =  async (meetingDetails) => {
  const meeting = new Meeting({...meetingDetails});
  await meeting.save();
  return meeting;
};

exports.getMeetings = (eventId) => {
  return Meeting.find({eventId}).then((meetings)=> {
    return meetings;
  });
}