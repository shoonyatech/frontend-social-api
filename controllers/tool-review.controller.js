const ToolReview = require("../models/tool-review.model.js");

// Create and Save a new toolReview
exports.create = (req, res) => {
  const toolReview = new ToolReview({ ...req.body, createdBy: req.user });

  // Save toolReview in the database
  toolReview
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the toolReview.",
      });
    });
};

// Retrieve and return all tools from the database.
exports.findAll = (req, res) => {
  ToolReview.find({ toolId: req.params.id })
    .then((reviews) => {
      res.send(reviews);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};

// Update a toolReview identified by the id in the request
exports.update = (req, res) => {
  ToolReview.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      comment: req.body.comment,
      toolId: req.body.toolId,
    },
    { new: true }
  )
    .then((toolReview) => {
      if (!toolReview) {
        return res.status(404).send({
          message: "toolReview not found with id " + req.params.id,
        });
      }
      res.send(toolReview);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "toolReview not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating toolReview with id " + req.params.id,
      });
    });
};

// Delete a toolReview with the specified id in the request
exports.delete = (req, res) => {
  ToolReview.findByIdAndRemove(req.params.id)
    .then((toolReview) => {
      if (!toolReview) {
        return res.status(404).send({
          message: "toolReview not found with id " + req.params.id,
        });
      }
      res.send({ message: "toolReview deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "toolReview not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete toolReview with id " + req.params.id,
      });
    });
};
