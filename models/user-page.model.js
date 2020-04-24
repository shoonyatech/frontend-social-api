const mongoose = require("mongoose");

const UserPageSchema = mongoose.Schema(
  {
    url: String,
    createdTime: Number,
    username: String,
    name: String,
    avatar: String,
    createdBy: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("UserPage", UserPageSchema);
