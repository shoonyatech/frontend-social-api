const mongoose = require("mongoose");

const LinkSchema = mongoose.Schema(
  {
    name: String,
    url: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Link", LinkSchema);
