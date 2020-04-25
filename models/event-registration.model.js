const mongoose = require("mongoose");

const EventRegistrationSchema = mongoose.Schema(
  {
    eventId:Number,
    username:String,
    createdBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
