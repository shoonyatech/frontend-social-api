const mongoose = require("mongoose");
const Tip = require("../models/tips.model");

exports.create = async (req, res) => {
  try {
    const tip = new Tip({...req.body, createdBy: req.user});
    const data = await tip.save();
    res.send(data);
  } catch(err) {
    res.status(500).send(err || 'error occurred while creating tip')
  }
}

exports.findAll = async (req, res) => {
  try {
   const tips = await Tip.find({});
   res.send(tips);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting tips');
  }
}

exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findOne({_id: id});
    res.send(tip);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting tip');
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findByIdAndUpdate(id, {...req.body}, {new: true});
    if (!tip) {
      res.status(404).send('no tip exists with' + id);
    }
    res.send(200);
  } catch (err) {
    res.status(500).send(err || 'error occurred while updating tip');
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findByIdAndRemove(id);
    if (!tip) {
      res.status(404).send('no tip exists with' + id);
    }
    res.send('tip deleted successfully');
  } catch (err) {
    res.status(500).send(err || 'error occurred while deleting tip');
  }
}
