const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    title: String,
    author: String,
    details: String,
    url: String,
    courtesy: String,
    courtesyUrl: String,
    tags: [String],
    medium: String,
    type: String, // blog/talk/video/podcast
    relatedSkills: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
