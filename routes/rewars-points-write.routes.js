module.exports = (app) => {
  const rewardPoints = require("../controllers/reward-points.controller.js");
  
  //getting all the reward points for user
  app.get('/getTransactions', rewardPoints.getRewardPointsForUser);

  //redeeming reward points
  app.get('/redeem', rewardPoints.redeem);
};
