module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    // retrieve current user profile
    app.get("/user", user.findAll);

    app.post("/usercreate", user.create);

};