const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema(
  {
    submission: String,
    challengeId: String,
    submittedBy: Object,
    votes: Array,
    comments: Array
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submission", SubmissionSchema);