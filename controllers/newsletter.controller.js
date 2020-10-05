const NewsletterSubscription = require("../models/newsletter-subscription.model");

exports.subscribe = async (req, res) => {
  let existingSubscription = await NewsletterSubscription.find({
    email: req.body.email,
    unSubscribe: req.body.unSubscribe,
  });

  if (existingSubscription.length) {
    res.send(existingSubscription[0]);
    return;
  }

  const newsletterSubscription = new NewsletterSubscription({
    email: req.body.email,
    unSubscribe: req.body.unSubscribe,
  });

  const subscription = await newsletterSubscription.save();
  res.send(subscription);
};

// Retrieve and return all subscription from the database.
exports.findAllSubscription = async (req, res) => {
  const subscriptions = await NewsletterSubscription.find();
  res.send(subscriptions);
};

exports.unSubscribe = (req, res) => {
  NewsletterSubscription.findOne({ email: req.params.email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with email " + req.params.email,
        });
      }
      user.unSubscribe = true;
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with email " + req.params.email,
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with email " + req.params.email,
      });
    });
};
