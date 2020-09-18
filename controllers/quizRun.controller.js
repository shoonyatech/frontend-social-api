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