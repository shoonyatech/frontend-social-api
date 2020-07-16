const Feedback = require("../models/feedback.model.js");

exports.create = async (req, res) => {
  const feedback = new Feedback({ ...req.body });
  try {
    const data = await feedback.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while saving the feedback.",
    });
  }
};
