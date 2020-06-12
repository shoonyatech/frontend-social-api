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
    let transaction = new RewardPoints({
      username,
      credited: 0,
      debited: redeemAmount,
      status: 'Pending',
      comment: 'Redeem Request',
      transactionDate: Date.now()
    });
    transaction = await transaction.save();
    res.send(transaction);
  } catch (err) {
    res.status(500).send(`Error while redeeming reward points for user ${req.user.username}`)
  }
}

// USED For testing
// async function saveRewardPoints(username) {
//   let transaction = new RewardPoints({
//     username,
//     credited: 1000,
//     debited: 0,
//     status: 'Pending',
//     comment: 'test',
//     transactionDate: Date.now()
//   });
//   await transaction.save();

//   transaction = new RewardPoints({
//     username,
//     credited: 1000,
//     debited: 0,
//     status: 'Pending',
//     comment: 'test',
//     transactionDate: Date.now()
//   });
//   await transaction.save();
// }