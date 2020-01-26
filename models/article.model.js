const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema(
  {
    title: String,
    author: String,
    onDescriptionChange: String,
    url: String,
    courtesy: String,
    courtesyUrl: String,
    tags: [String],
    medium: String, // blog/video/podcast
    type: String, // talk/tutorial/casestudy
    relatedSkills: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
