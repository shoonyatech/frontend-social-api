const mongoose = require("mongoose");

const ChallengeSchema = mongoose.Schema(
  {
    title: String,
    uniqueId: String,
    problemStatement: String,
    problemStatementUrl: String,
    tags: Array,
    startTime: Date,
    endTime: Date,
    createdBy: Object,
    published: Boolean,
    winnerSubmissionId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
