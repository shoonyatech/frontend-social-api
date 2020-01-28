const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,
    url: String,
    courtesy: String,
    courtesyUrl: String,
    tags: [String],
    medium: String, // blog/video/podcast
    type: String, // talk/tutorial/casestudy/announcement
    relatedSkills: [],
    createdBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
