module.exports = (app) => {
    const userPage = require("../controllers/user-page.controller.js");
    
    // get all online user by page
    app.post("/userpage/online/", userPage.findAllUserByURL);
  
    // get count of online users
    app.post("/userpage/online/count", userPage.getUserCountByURL);
  };
  