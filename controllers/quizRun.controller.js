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
exports.findOne = (req, res) => {
  QuizRun.find({ uniqueId: req.params.uniqueId})
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