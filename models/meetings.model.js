const mongoose = require("mongoose");

const MeetingSchema = mongoose.Schema(
  {
    title: String,
    meetingId: String,
    createdBy: Object,
    eventId: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meetings", MeetingSchema);
