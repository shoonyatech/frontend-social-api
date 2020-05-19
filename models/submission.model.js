const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema(
  {
    submission: String,
    upVote: Number,
    downVote: Number,
    challengeId: String,
    startTime: Date,
    endTime: Date,
    submittedBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submission", SubmissionSchema);