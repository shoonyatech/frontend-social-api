const QuizRunSubmission = require("../models/quizRunSubmission.model.js");
const Quiz = require("../models/quiz.model.js");

exports.create = (req, res) => {
  Quiz.findById(req.body.quizId)
    .then((response) => {
      let point = 0;
      response.questions.filter((question) => {
        if (question.questionNo == req.body.questionNo) {
          if (question.answer === req.body.selectedOption) {
            answer = question.answer;
            point = Math.round((req.body.timer / question.duration) * 100);
          } else {
            point = 0;
          }
        }
      });
      const quizRunSubmission = new QuizRunSubmission({
        ...req.body,
        points: point,
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
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while find quiz .",
      });
    });
};

exports.findSelectedOptionsQuestionResults = (req, res) => {
  const allKey = [];
  const options = [];
  const users = [];
  var i = 0;
  Quiz.find({ _id: req.params.quizId })
    .then((response) => {
      if (!response) {
        return res.status(404).send({
          message: "quiz not found with quizId " + req.params.quizI,
        });
      }
      response.map((re) => {
        re.questions.map((resp) => {
          if (resp.questionNo == req.params.questionIndex) {
            options.push(resp.options);
          }
        });
        options.map((option) => {
          option.map((key) => {
            allKey.push(key.key);
          });
        });

        allKey.map((selected) => {
          QuizRunSubmission.find({
            quizId: req.params.quizId,
            runId: req.params.runId,
            questionNo: req.params.questionIndex,
            selectedOption: selected,
          })
            .then((response) => {
              if (!response) {
                return res.status(404).send({
                  message: "quiz not found with ",
                });
              }
              users.push({ key: selected, length: response.length });
              i = i + 1;
              if (i === allKey.length) {
                users.sort((a, b) =>
                  a.key > b.key ? 1 : b.key > a.key ? -1 : 0
                );
                res.send(users);
              }
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving the options.",
              });
            });
        });
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "quiz not found with quizId " + req.params.quizI,
        });
      }
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the options.",
      });
    });
};

exports.findOne = (req, res) => {
  const result = {
    username: "",
    points: "",
  };
  var sum = 0;
  const allPoints = [];
  QuizRunSubmission.find({
    quizId: req.params.quizId,
    runId: req.params.runId,
    username: req.params.username,
  })
    .then((resp) => {
      if (!resp.length) {
        return res.status(404).send({
          message: "result not found",
        });
      }
      resp.map((re) => {
        re.points;
        allPoints.push(re.points);
      });
      allPoints.map((point) => {
        sum = sum + point;
      });
      result.username = req.params.username;
      result.points = sum;
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the result.",
      });
    });
};

exports.findAll = (req, res) => {
  var uniqueArray = [];
  const Options = [];
  const users = [];
  var sum = 0;
  QuizRunSubmission.find({
    quizId: req.params.quizId,
    runId: req.params.runId,
  })
    .then((response) => {
      if (!response) {
        return res.status(404).send({
          message: "quiz not found with quizId " + req.params.quizI,
        });
      }
      response.map((re) => {
        Options.push(re.username);
      });
      uniqueArray = Options.filter(function (elem, pos) {
        return Options.indexOf(elem) == pos;
      });
      uniqueArray.map((re, index) => {
        QuizRunSubmission.find({
          quizId: req.params.quizId,
          runId: req.params.runId,
          username: re,
        })
          .then((response) => {
            sum = 0;
            response.map((user, userIndex) => {
              sum = sum + user.points;
              if (userIndex + 1 == response.length) {
                users.push({ username: user.username, points: sum });
              }
            });
            if (index + 1 == uniqueArray.length) {
              users.sort((a, b) =>
                a.points < b.points ? 1 : b.points < a.points ? -1 : 0
              );
              res.send(users.slice(0, 3));
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving the results.",
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the results.",
      });
    });
};

exports.getAnswer = (req, res) => {
  Quiz.findById(req.params.quizId)
    .then((response) => {
      response.questions.filter((question) => {
        if (question.questionNo == req.params.questionIndex) {
          res.send(question.answer);
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the answer.",
      });
    });
};
