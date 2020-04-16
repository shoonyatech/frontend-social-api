const NewsletterSubscription = require("../models/newsletter-subscription.model");

exports.subscribe = async (req, res) => {
  let existingSubscription = await NewsletterSubscription.find({
    email: req.body.email,
  });

  if (existingSubscription.length) {
    res.send(existingSubscription[0]);
    return;
  }

  const newsletterSubscription = new NewsletterSubscription({
    email: req.body.email,
  });

  const subscription = await newsletterSubscription.save();
  res.send(subscription);
};

// Retrieve and return all subscription from the database.
exports.findAllSubscription = async (req, res) => {
  const subscriptions = await NewsletterSubscription.find();
  res.send(subscriptions);
};
