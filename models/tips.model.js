const mongoose = require("mongoose");

const TipsSchema = mongoose.Schema(
  {
    twitterLink: String,
    tags: Array,
    createdBy: Object,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tips", TipsSchema);
