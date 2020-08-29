const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: String,
    markdownUrl: String,
    tags: [String],
    author: String,
    description: String,
    body:String,
    type: String,
    relatedSkills: [],
    createdBy: Object,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
