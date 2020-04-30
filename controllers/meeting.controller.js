const Meeting = require("../models/meetings.model.js");

exports.saveMeeting =  async (meetingDetails) => {
  const meeting = new Meeting({...meetingDetails});
  await meeting.save();
  return meeting;
};

exports.getMeetings = (eventId) => {
  return Meeting.find({eventId, isPrivate: {$ne: true}}).then((meetings)=> {
    return meetings;
  });
}

exports.getPrivateMeetings = (eventId, user) => {
  return Meeting.find({eventId, isPrivate: true, createdBy: user}).then((meetings)=> {
    return meetings;
  });
}