const Submission = require("../models/submission.model");
const Challenge = require("../models/challenge.model");
const rewardPointsController = require("./reward-points.controller.js");

const CHALLENGE_SOLUTION_REWARD_POINTS = 50;
var mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    const submission = new Submission({
      ...req.body,
      submittedBy: req.user,
      votes: [],
      comments: [],
    });
    const data = await submission.save();
    rewardPointsController.addRewardPoints(
      req.user.username,
      CHALLENGE_SOLUTION_REWARD_POINTS,
      `For Submitting Challenge Solution`
    );
    res.send(data);
  } catch (err) {
    res.status(500).send(err || "error occurred while saving submission");
  }
};

exports.analytics = (req, res) => {
  const createdAt = req.params.createdAt;
  Submission.find({
    createdAt: {
      $gte: `${createdAt} 00:00:00.507Z`,
      $lt: `${createdAt} 23:59:59.507Z`,
    },
  })
    .then((submission) => {
      if (!submission) {
        return res.status(404).send({
          message: "submission not found with createdAt " + createdAt,
        });
      }
      res.send(submission);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "submission not found with createdAt " + createdAt,
        });
      }
      return res.status(500).send({
        message: "Error retrieving submission with submissionname " + title,
      });
    });
};

exports.getSubmissionsByChallengeUniqueId = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findOne({ uniqueId: challengeId });

    if (challenge) {
      let submissions;
      if (challenge.published) {
        submissions = await Submission.find({ challengeId: challengeId });
      } else {
        submissions = await Submission.find({
          challengeId: challengeId,
          "submittedBy.username": req.user.username,
        });
      }
      res.send(submissions);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err ||
          "error while fetching submisson for challengeId" +
            req.params.challengeId
      );
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) {
      res.status(404).send("submission not found");
    } else {
      res.send(200);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err || "error while deleting submisson for submissionId" + req.params.id
      );
  }
};

exports.upVote = async (req, res) => {
  return vote(req, res, 1);
};

exports.downVote = async (req, res) => {
  return vote(req, res, -1);
};

const vote = async (req, res, vote) => {
  try {
    const id = req.params.id;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(400).send("submission not found");
    }

    if (!submission.votes) {
      submission.votes = [];
    }

    if (submission.votes.find((x) => x.username === req.user.username)) {
      submission.votes = submission.votes.map((x) => {
        if (x.username === req.user.username) {
          return { ...x, vote };
        }
        return x;
      });
    } else {
      submission.votes.push({
        username: req.user.username,
        vote,
      });
    }

    console.log(submission);

    const updatedValue = await Submission.findByIdAndUpdate(id, submission, {
      new: true,
    });
    if (!updatedValue) {
      return res.status(400).send("Failed to vote");
    } else {
      return res.status(200).send(submission);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err || "error while voting submission for submissionId" + req.params.id
      );
  }
};

exports.addComment = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const comment = req.body.comment;

    const submission = await Submission(submissionId);

    if (!submission) {
      return res.status(400).send("submission not found");
    }

    comment.id = new mongoose.mongo.ObjectId();
    submission.comments.push(comment);
    console.log(submission);
    const updatedValue = await Submission.findByIdAndUpdate(id, submission, {
      new: true,
    });
    if (!updatedValue) {
      return res.status(400).send("Failed to comment");
    } else {
      return res.status(200).send(submission);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err ||
          "error while commenting submission for submissionId" + req.params.id
      );
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const commentId = req.params.commentId;
    const submission = await Submission(submissionId);

    if (!submission) {
      return res.status(400).send("submission not found");
    }
    rewardPointsController.deductRewardPoints(
      req.user.username,
      CHALLENGE_SOLUTION_REWARD_POINTS,
      `For deleting the Challenge Solution`
    );
    submission.comments = submission.comments.filter(
      (comment) => comment.id !== commentId
    );
    console.log(submission);
    const updatedValue = await Submission.findByIdAndUpdate(id, submission, {
      new: true,
    });
    if (!updatedValue) {
      return res.status(400).send("Failed to delete");
    } else {
      return res.status(200).send(submission);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err || "error while deleting comment for submissionId" + req.params.id
      );
  }
};

exports.updateComment = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const commentId = req.params.commentId;
    const updatedComment = req.body.comment;
    const submission = await Submission(submissionId);

    if (!submission) {
      return res.status(400).send("submission not found");
    }
    submission.comments = submission.comments.map((comment) => {
      if (comment.id === commentId) {
        comment = updatedComment;
      }
    });

    console.log(submission);
    const updatedValue = await Submission.findByIdAndUpdate(id, submission, {
      new: true,
    });
    if (!updatedValue) {
      return res.status(400).send("Failed to update");
    } else {
      return res.status(200).send(submission);
    }
  } catch (err) {
    res
      .status(500)
      .send(
        err || "error while update comment for submissionId" + req.params.id
      );
  }
};
