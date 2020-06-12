module.exports = (app) => {
  const rewardPoints = require("../controllers/reward-points.controller.js");
  
  //getting all the reward points for user
  app.get('/reward-points', rewardPoints.getRewardPointsForUser);

  //redeeming reward points
  app.post('/redeem', rewardPoints.redeem);
};
