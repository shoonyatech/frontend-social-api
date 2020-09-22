const mongoose = require("mongoose");
const Challenge = require("../models/challenge.model");
const helper = require("../utils/helperMethods");

exports.create = async (req, res) => {
  try {
    const uniqueId = helper.generateUniqueId(req.body.title);
    const challenge = new Challenge({
      ...req.body,
      createdBy: req.user,
      winnerSubmissionId: null,
      uniqueId,
    });
    const data = await challenge.save();
    res.send(data);
  } catch (err) {
    res.status(500).send(err || "error occurred while creating challenge");
  }
};

exports.findAll = async (req, res) => {
  try {
    // TODO: change it if pagination is required and sort order
    const challenges = await Challenge.find({});
    res.send(challenges);
  } catch (err) {
    res.status(500).send(err || "error occurred while getting challenges");
  }
};

exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const challenge = await Challenge.findOne({ _id: id });
    res.send(challenge);
  } catch (err) {
    res.status(500).send(err || "error occurred while getting challenge");
  }
};

exports.findByUniqueId = async (req, res) => {
  try {
    const uniqueId = req.params.uniqueId;
    const challenge = await Challenge.findOne({ uniqueId: uniqueId });
    res.send(challenge);
  } catch (err) {
    res.status(500).send(err || "error occurred while getting challenge");
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!challenge) {
      res.status(404).send("no challenge exists with" + id);
    }
    res.send(200);
  } catch (err) {
    res.status(500).send(err || "error occurred while updating challenge");
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const challenge = await Challenge.findByIdAndRemove(id);
    if (!challenge) {
      res.status(404).send("no challenge exists with" + id);
    }
    res.send("challenge deleted successfully");
  } catch (err) {
    res.status(500).send(err || "error occurred while deleting challenge");
  }
};
