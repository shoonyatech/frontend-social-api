const mongoose = require("mongoose");

const MeetingSchema = mongoose.Schema(
  {
    title: String,
    meetingId: String,
    createdBy: Object,
    eventId: String,
    userId: String,
    isPrivate: Boolean,
    allowedUsers: [],
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meetings", MeetingSchema);
