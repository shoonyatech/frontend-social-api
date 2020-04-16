const mongoose = require("mongoose");

const NewsletterSubscriptionSchema = mongoose.Schema(
  {
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "NewsletterSubscription",
  NewsletterSubscriptionSchema
);
