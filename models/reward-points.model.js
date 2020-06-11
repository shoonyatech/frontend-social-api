const mongoose = require("mongoose");

const RewardPointsSchema = mongoose.Schema({
  username: String,
  credited: Number,
  debited: Number,
  status: String,
  transactionDate: Date,
  comment: String
});

module.exports = mongoose.model("RewardPoints", RewardPointsSchema);