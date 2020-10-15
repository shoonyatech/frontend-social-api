const QuizRun = require("../models/quizRun.model.js");

exports.create = (req, res) => {
  const runId = Math.floor(Math.random() * 10000) + 1;
  const quizRun = new QuizRun({
    quizId: req.body.quizId,
    createdBy: req.user,
    isActive: false,
    runId: runId,
  });
  quizRun
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the quizRun.",
      });
    });
};

// Retrieve and return all quizs from the database.
exports.findAll = async (req, res) => {
  QuizRun.find()
    .then((quizRuns) => {
      let response = { results: [] };
      if (quizRuns.length) {
        response.results = quizRuns;
      }
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving quizes.",
      });
    });
};
exports.findOne = (req, res) => {
  QuizRun.findOne({ quizId: req.params.quizId })
    .sort("-createdAt")
    .then((quizrun) => {
      if (!quizrun) {
        return res.status(404).send({
          message: "quizrun not found with username " + req.params.username,
        });
      }
      res.send(quizrun);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quizrun not found with username " + req.params.username,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving quizrun with username " + req.params.username,
      });
    });
};

// Find a single quiz with a id
exports.findQuestionResults = (req, res) => {
  QuizRun.find({
    runId: req.params.runId,
    questionIndex: req.params.questionIndex,
  })
    .then((quizRun) => {
      if (!quizRun) {
        return res.status(404).send({
          message: "quiz not found with runId " + req.params.runId,
        });
      }
      res.send(quizRun);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with runId " + req.params.runId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving quiz with runId " + req.params.runId,
      });
    });
};

// Update a quiz identified by the id in the request
exports.update = (req, res) => {
  let isActive;
  if (req.params.questionIndex == 0) {
    isActive = false;
  } else {
    isActive = true;
  }
  QuizRun.findOneAndUpdate(
    { quizId: req.params.quizId, runId: req.params.runId },
    { currentQuestion: req.params.questionIndex, isActive: isActive },
    { new: true }
  )
    .then((quizRun) => {
      if (!quizRun) {
        return res.status(404).send({
          message: "quiz run not found with id " + req.params.runId,
        });
      }
      res.send(quizRun);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating quiz with id " + req.params.id,
      });
    });
};
