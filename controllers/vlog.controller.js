const mongoose = require("mongoose");
const VLog = require("../models/vlog.model");

exports.create = async (req, res) => {
  try {
    const uniqueId = await generateUniqueId(req.body.title);
    const vLog = new VLog({...req.body, createdBy: req.user, uniqueId});
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

    const oldVLog = await VLog.findOne({_id: id});
    const vLog = await VLog.findByIdAndUpdate(id, {...req.body, uniqueId: oldVLog.uniqueId}, {new: true});
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

async function generateUniqueId(title) {
  let _t = title.toLowerCase().replace('catch up', '').trim().replace(' ', '-');

  const vlogs = await searchByRegex(_t);
  return vlogs.length ? (_t + `-${vlogs.length}`) : _t;
}

async function searchByRegex(text) {
  try {
    var regexp = new RegExp(`^${text}[0-9]*`);
    const vlogs = await VLog.find({ uniqueId: regexp});
    return vlogs;
  } catch (err) {
    return [];
  }
}

exports.findByUniqueId = async (req, res) => {
  try {
    const id = req.params.id;
    const vLog = await VLog.findOne({uniqueId: id});
    res.send(vLog);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting vLog');
  }
}
