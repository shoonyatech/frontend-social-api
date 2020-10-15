const QuizRunSubmission = require("../models/QuizRunSubmission.model.js");

exports.create = (req, res) => {
  const quizRunSubmission = new QuizRunSubmission({
    ...req.body,
    createdBy: req.user,
  });
  QuizRunSubmission.findOne({
    username: req.body.username,
    quizId: req.body.quizId,
    runId: req.body.runId,
    questionNo: req.body.questionNo,
  })
    .then((response) => {
      if (response == null) {
        quizRunSubmission
          .save()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while submiting the answer.",
            });
          });
      } else {
        return res.status(404).send({
          message: req.body.username + " has already posted the answer",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding the submission.",
      });
    });
};

exports.findSelectedOptionsQuestionResults = (req, res) => {
  const users = {
    A: [],
    B: [],
    C: [],
    D: [],
  };
  QuizRunSubmission.find({
    quizId: req.params.quizId,
    runId: req.params.runId,
    questionNo: req.params.questionIndex,
    selectedOption: "A",
  })
    .then((quizRun) => {
      users.A.push(quizRun.length);
      QuizRunSubmission.find({
        runId: req.params.runId,
        questionNo: req.params.questionIndex,
        selectedOption: "B",
      }).then((quizRun) => {
        users.B.push(quizRun.length);
        QuizRunSubmission.find({
          runId: req.params.runId,
          questionNo: req.params.questionIndex,
          selectedOption: "C",
        }).then((quizRun) => {
          users.C.push(quizRun.length);
          QuizRunSubmission.find({
            runId: req.params.runId,
            questionNo: req.params.questionIndex,
            selectedOption: "D",
          }).then((quizRun) => {
            users.D.push(quizRun.length);
            res.send(users);
          });
        });
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving quiz with runId " + req.params.runId,
      });
    });
};
