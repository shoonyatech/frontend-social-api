const Quiz = require("../models/quiz.model.js");

exports.create = (req, res) => {
    const Quiz = new Quiz({ ...req.body, createdBy: req.user });
    quiz
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the quiz."
            });
        });
};

// Retrieve and return all quiz from the database.
exports.findAll = async (req, res) => {
    const {
        searchText,
        skills = "",
    } = req.query;
    let filterObj = {};
    let filter = []

    if (searchText) {
        filter.push({
            $or: [
                { title: { $regex: searchText, $options: "i" } }
            ]
        });
    }

    if (filter.length) {
        filterObj = {
            $and: filter
        };
    }

    const limit = Number(req.query.limit) || 100
    const page = Number(req.query.page) || 1

    Quiz.find(filterObj)
        .sort({ createdAt: "descending" })
        .limit(limit)
        .skip(limit * (page - 1))
        .then(quiz => {
            let response = { results: [] };
            if (quiz.length) {
                response.results = quiz;
            }
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving quiz."
            });
        });
};

// Find a single quiz with a id
exports.findOne = (req, res) => {
    Quiz.findById(req.params.id)
        .then(quiz => {
            if (!quiz) {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            res.send(quiz);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving quiz with id " + req.params.id
            });
        });
};

// Update a quiz identified by the id in the request
exports.update = (req, res) => {
    Quiz.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body
        },
        { new: true }
    )
        .then(quiz => {
            if (!quiz) {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            res.send(quiz);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating quiz with id " + req.params.id
            });
        });
};

// Delete a quiz with the specified id in the request
exports.delete = (req, res) => {
    Quiz.findByIdAndRemove(req.params.id)
        .then(quiz => {
            if (!quiz) {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            res.send({ message: "quiz deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "quiz not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete quiz with id " + req.params.id
            });
        });
};