const Comment = require("../models/comment.model.js");

// Create and Save a new comment
exports.create = (req, res) => {
    const comment = new Comment({ ...req.body, createdBy: req.user });

    // Save comment in the database
    comment
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

// Retrieve and return all comments from the database.
exports.findAll = (req, res) => {
    Comment.find({ parentId: req.params.id })
        .then((comments) => {
            res.send(comments);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving comments.",
            });
        });
};

// Update a comment identified by the id in the request
exports.update = (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.id,
        {
            parentId: req.body.parentId,
            commentId: req.body.commentId,
            commentText: req.body.commentText,
            rating: req.body.rating,
            createdBy: req.body.createdBy,
            replies: req.body.replies,
        },
        { new: true }
    )
        .then((comment) => {
            if (!comment) {
                return res.status(404).send({
                    message: "comment not found with id " + req.params.id,
                });
            }
            res.send(comment);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "comment not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                message: "Error updating comment with id " + req.params.id,
            });
        });
};

// Delete a comment with the specified id in the request
exports.delete = (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
        .then((comment) => {
            if (!comment) {
                return res.status(404).send({
                    message: "comment not found with id " + req.params.id,
                });
            }
            res.send({ message: "Comment deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "comment not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                message: "Could not delete comment with id " + req.params.id,
            });
        });
};
