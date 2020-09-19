const QuizRun = require("../models/quizRun.model.js");

exports.create = (req, res) => {
  const uniqueId = Math.floor(Math.random() * 10000) + 1;
  const quizRun = new QuizRun({ ...req.body, createdBy: req.user , uniqueId });
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

// Find a single quiz with a id
exports.findQuestionResults = (req, res) => {
  QuizRun.find({ uniqueId: req.params.uniqueId, questionIndex: req.params.questionIndex})
    .then((quizRun) => {
      if (!quizRun) {
        return res.status(404).send({
          message: "quiz not found with uniqueId " + req.params.uniqueId,
        });
      }
      res.send(quizRun);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with uniqueId " + req.params.uniqueId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving quiz with uniqueId " + req.params.uniqueId,
      });
    });
};

// Update a quiz identified by the id in the request
exports.update = (req, res) => {
  QuizRun.findOneAndUpdate(
    { uniqueId: req.params.runId },
    { currentQuestion: req.params.questionIndex }
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