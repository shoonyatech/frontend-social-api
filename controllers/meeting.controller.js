const uuid = require("uuid/v4");
const Meeting = require("../models/meetings.model.js");

const saveMeeting = async (meetingDetails) => {
  const meeting = new Meeting({ ...meetingDetails });
  await meeting.save();
  return meeting;
};

const updateMeeting = (meetingId, meetingDetails) => {
  return Meeting.findByIdAndUpdate(
    meetingId,
    { ...meetingDetails },
    { new: true }
  );
};

const getMeetingsByEventId = (eventId) => {
  return Meeting.find({ eventId })
    .sort({ title: "ascending" })
    .then((meetings) => {
      return meetings;
    });
};

const getMeetingsByUserId = (userId) => {
  return Meeting.find({ userId })
    .sort({ title: "ascending" })
    .then((meetings) => {
      return meetings;
    });
};

const deleteMeeting = (meetingId) => {
  return Meeting.findByIdAndRemove(meetingId).then((meeting) => {
    return meeting;
  });
};

exports.findMeetings = async (req, res) => {
  const eventId = req.query.eventId;
  const userId = req.query.userId;
  try {
    let meetings = [];
    if (eventId) {
      meetings = await getMeetingsByEventId(eventId);
    } else if (userId) {
      meetings = await getMeetingsByUserId(userId);
    } else {
      return res.status(400).send({ message: "Bad Request" });
    }
    return res.send(meetings);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
};

exports.createMeeting = async (req, res) => {
  const title = req.body.title;
  const isPrivate = req.body.isPrivate;
  const meetingId = title + "-" + uuid();
  const allowedUsers = req.body.allowedUsers || [];
  const eventId = req.body.eventId || null;
  const userId = req.body.userId || null;

  try {
    await saveMeeting({
      title,
      eventId,
      userId,
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
  const eventId = req.body.eventId || null;
  const userId = req.body.userId || null;

  try {
    const updatedMeeting = await updateMeeting(req.params.meetingId, {
      title,
      eventId,
      userId,
      createdBy: req.user,
      meetingId,
      isPrivate,
      allowedUsers,
    });

    if (!updatedMeeting) {
      return res.status(404).send({
        message: "meeting not found with id " + req.params.meetingId,
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

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await deleteMeeting(req.params.meetingId);
    if (!meeting) {
      return res.status(404).send({
        message: "meeting not found with id " + req.params.meetingId,
      });
    }
    return res.send();
  } catch (ex) {
    console.log(ex);
    return res.status(400).send();
  }
};
