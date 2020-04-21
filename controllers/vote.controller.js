const Vote = require("../models/vote.model.js");

// Create and Save a new vote
exports.create = (req, res) => {
    const vote = new Vote({ ...req.body, createdBy: req.user });

    // Save vote in the database
    vote
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the comment.",
            });
        });
};

// Check if user canVote
exports.canVote = (req, res) => {
    const username = req.user.username;
    Vote.find({ parentId: req.params.id, createdBy: { username: username } })    
        .then((votes) => {
            if (votes.length > 0) {
                res.send({ canVote: false });
            }
            res.send({ canVote: true });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving canVote.",
            });
        });
};