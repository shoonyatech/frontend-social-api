const mongoose = require("mongoose");
const Tip = require("../models/tips.model");
const rewardPointsController = require("./reward-points.controller.js");

const TIP_REWARD_POINTS = 50;
exports.create = async (req, res) => {
  try {
    const tip = new Tip({ ...req.body, createdBy: req.user });
    const data = await tip.save();
    rewardPointsController.addRewardPoints(
      req.user.username,
      TIP_REWARD_POINTS,
      `For creating a Tech Tip`
    );
    res.send(data);
  } catch (err) {
    res.status(500).send(err || "error occurred while creating tip");
  }
};

exports.findAll = async (req, res) => {
  const andQuery = getQuery(req.query);

  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;

  try {
    const tips = await Tip.find(finalQuery)
      .sort({ createdAt: "descending" })
      .limit(limit)
      .skip(limit * (page - 1));
    res.send(tips);
  } catch (err) {
    res.status(500).send(err || "error occurred while getting tips");
  }
};

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
exports.analytics = (req, res) => {
  if (req.user.admin) {
    const createdAt = req.params.createdAt;
    Tip.find({
      createdAt: {
        $gte: `${createdAt} 00:00:00.000Z`,
        $lt: `${createdAt} 23:59:59.999Z`,
      },
    })
      .then((tip) => {
        if (!tip) {
          return res.status(404).send({
            message: "tip not found with createdAt " + createdAt,
          });
        }
        res.send(tip);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "tip not found with createdAt " + createdAt,
          });
        }
        return res.status(500).send({
          message: "Error retrieving tip with tipname " + title,
        });
      });
  } else {
    return res.status(403).send({
      message: "Error retrieving user with username " + req.user.username,
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tips = await Tip.find({});
    let tags = tips.reduce((acc, val) => {
      return acc.concat(val.tags);
    }, []);
    res.send(Array.from(new Set(tags)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting tags");
  }
};

exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findOne({ _id: id });
    res.send(tip);
  } catch (err) {
    res.status(500).send(err || "error occurred while getting tip");
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!tip) {
      res.status(404).send("no tip exists with" + id);
    }
    res.send(200);
  } catch (err) {
    res.status(500).send(err || "error occurred while updating tip");
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await Tip.findByIdAndRemove(id);
    if (!tip) {
      res.status(404).send("no tip exists with" + id);
    }
    rewardPointsController.deductRewardPoints(
      req.user.username,
      TIP_REWARD_POINTS,
      `For deleting the Tech Tip`
    );
    res.send("tip deleted successfully");
  } catch (err) {
    res.status(500).send(err || "error occurred while deleting tip");
  }
};
