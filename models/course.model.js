const mongoose = require("mongoose");

const CodeSubtitleSchema = mongoose.Schema({
  time: String,
  file: String,
});

const TopicSchema = mongoose.Schema({
  url: String,
  title: String,
  codeLink: String,
  videoUrl: String,
  codeSubtitles: [CodeSubtitleSchema],
});

const ChapterSchema = mongoose.Schema({
  chapterNo: Number,
  title: String,
  description: String,
  topics: [TopicSchema],
});

const CourseSchema = mongoose.Schema(
  {
    title: String,
    technology: String,
    description: String,
    introductoryVideoUrl: String,
    author: {
      name: String,
      description: String,
    },
    chapters: [ChapterSchema],
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CodeSubtitle", CodeSubtitleSchema);
module.exports = mongoose.model("Topic", TopicSchema);
module.exports = mongoose.model("Chapter", ChapterSchema);
module.exports = mongoose.model("Course", CourseSchema);
