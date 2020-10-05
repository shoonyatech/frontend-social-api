const mongoose = require("mongoose");

const NewsletterSubscriptionSchema = mongoose.Schema(
  {
    email: String,
    unSubscribe: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "NewsletterSubscription",
  NewsletterSubscriptionSchema
);
