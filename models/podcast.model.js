const mongoose = require("mongoose");

const EpisodeSchema = mongoose.Schema(
  {
    title: String,
    overview: String,
    participants: [],
  },
  {
    timestamps: true,
  }
);
const PodcastSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    episodes: [EpisodeSchema],
    skills: [],
    url: String,
    createdBy: Object,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Episode", EpisodeSchema);
module.exports = mongoose.model("Podcast", PodcastSchema);
