const QuizParticipants = require("../models/quiz-participants.model.js");

exports.create = (req, res) => {
  const quizParticipants = new QuizParticipants({ ...req.body });
  QuizParticipants.findOne({
    quizId: req.body.quizId,
    runId: req.body.runId,
    username: req.body.username,
  })
    .then((response) => {
      if (response == null) {
        quizParticipants
          .save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the quiz participants.",
            });
          });
      } else {
        return res.status(404).send({
          message: req.body.username + " has already entered the quiz",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the quiz participants.",
      });
    });
};

// Retrieve and return all quizs from the database.
exports.findAll = async (req, res) => {
  QuizParticipants.find({
    quizId: req.params.quizId,
    runId: req.params.runId,
  })
    .then((quizParticipants) => {
      let response = {};
      if (quizParticipants.length) {
        response = quizParticipants;
      }
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving quiz participants.",
      });
    });
};
