const mongoose = require("mongoose");
const VLog = require("../models/vlog.model");

exports.create = async (req, res) => {
  try{
    const vLog = new VLog({...req.body, createdBy: req.user});
    const data = await vLog.save();
    res.send(data);
  } catch(err) {
    res.status(500).send(err || 'error occurred while creating vLog')
  }
}

exports.findAll = async (req, res) => {
  try {
   const vLogs = await VLog.find({});
   res.send(vLogs);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting vLogs');
  }
}

exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const vLog = await VLog.findOne({_id: id});
    res.send(vLog);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting vLog');
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const vLog = await VLog.findByIdAndUpdate(id, {...req.body}, {new: true});
    if (!vLog) {
      res.status(404).send('no vLog exists with' + id);
    }
    res.send(200);
  } catch (err) {
    res.status(500).send(err || 'error occurred while updating vLog');
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const vLog = await VLog.findByIdAndRemove(id);
    if (!vLog) {
      res.status(404).send('no vLog exists with' + id);
    }
    res.send('vLog deleted successfully');
  } catch (err) {
    res.status(500).send(err || 'error occurred while deleting vLog');
  }
}
