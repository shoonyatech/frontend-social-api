const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: String,
    markdownUrl: String,
    createdBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
