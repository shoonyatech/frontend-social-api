const mongoose = require("mongoose");

const FreelanceSchema = mongoose.Schema(
  {
    username: String,
    aboutMe: String,
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Freelance", FreelanceSchema);
