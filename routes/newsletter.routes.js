module.exports = (app) => {
  const newsletter = require("../controllers/newsletter.controller.js");

  // Create a new newsletter/subscribe
  app.post("/newsletter/subscribe", newsletter.subscribe);

  // Retrieve all newsletter/subscribe
  app.get("/newsletter/subscribe", newsletter.findAllSubscription);

  //unsubscribe from newsletter
  app.put("/newsletter/unsubscribe/:email", newsletter.unSubscribe);
};
