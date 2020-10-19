const Quiz = require("../models/quiz.model.js");

exports.create = (req, res) => {
  const quiz = new Quiz({ ...req.body, createdBy: req.user });
  quiz
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the quiz.",
      });
    });
};

// Retrieve and return all quizs from the database.
exports.findAll = async (req, res) => {
  Quiz.find()
    .then((quizes) => {
      let response = { results: [] };
      if (quizes.length) {
        response.results = quizes;
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
  Quiz.findById(req.params.id)
    .then((quiz) => {
      if (!quiz) {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      res.send(quiz);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving quiz with id " + req.params.id,
      });
    });
};
// Update a quiz identified by the id in the request
exports.update = (req, res) => {
  Quiz.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((quiz) => {
      if (!quiz) {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      res.send(quiz);
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

// Delete a quiz with the specified id in the request
exports.delete = (req, res) => {
  Quiz.findByIdAndRemove(req.params.id)
    .then((quiz) => {
      if (!quiz) {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      res.send({ message: "quiz deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete quiz with id " + req.params.id,
      });
    });
};

exports.findOneById = (req, res) => {
  Quiz.findOne({ _id: req.params.id })
    .select("-questions.answer")
    .then((quiz) => {
      if (!quiz) {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      res.send(quiz);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving quiz with id " + req.params.id,
      });
    });
};
