const RewardPoints = require("../models/reward-points.model.js");

exports.getRewardPointsForUser = async (req, res) => {
  try {
    const username =req.user.username
    const transactions = await RewardPoints.find({username})
    res.send(transactions);
  } catch (err) {
    res.status(500).send(`Error getting reward points for user ${req.user.username}`);
  }
}

exports.redeem = async (req, res) => {
  try {
    const username = req.user.username;
    const redeemAmount = req.body.redeemAmount;
    const transaction = new RewardPoints({
      username,
      credited: 0,
      debited: redeemAmount,
      status: 'Pending',
      comment: 'Redeem Request',
      transactionDate: Date.now()
    });
    const transaction = await RewardPoints.save(transaction);
    res.send(transaction);
  } catch (err) {
    res.status(500).send(`Error while redeeming reward points for user ${req.user.username}`)
  }
}s