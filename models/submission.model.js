const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema(
  {
    submission: String,
    upVote: Number,
    downVote: Number,
    challengeId: String,
    submittedBy: Object
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submission", SubmissionSchema);