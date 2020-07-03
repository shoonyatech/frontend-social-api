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
  const andQuery = getQuery(req.query);

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }
  try {
   const tips = await Tip.find(finalQuery);
   res.send(tips);
  } catch (err) {
    res.status(500).send(err || 'error occurred while getting tips');
  }
}

function getQuery(query) {
  const tags = query.tags;
  let tagsQuery = {};
  let andQuery = [];

  if (tags) {
    let _tags = tags.split(",");
    if (_tags.length) {
      tagsQuery["$or"] = [{ tags: { $in: _tags } }];
      andQuery.push(tagsQuery);
    }
  }
  return andQuery;
}

exports.getAllTags = async (req, res) => {
  try {
    const tips = await Tip.find({});
    let tags = tips.reduce((acc, val) => {
     return acc.concat(val.tags);
    }, []);
    res.send(Array.from(new Set(tags)));
   } catch (err) {
     res.status(500).send(err || 'error occurred while getting tags');
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
