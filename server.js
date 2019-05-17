var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
var jwt = require("express-jwt");

mongoose.Promise = global.Promise;

var app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  // .connect(process.env.MONGODB_URI, {
    .connect('mongodb://heroku_gss6930f:gprsvs03focdoru4q5ev54rpab@ds259241.mlab.com:59241/heroku_gss6930f?authSource=heroku_gss6930f', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

/*  heartbeat
 */
app.get("/", function(req, res) {
  res.status(200).json({ message: "Welcome to Frontend Social API! v1" });
});

require("./routes/auth.routes.js")(app);
require("./routes/job.routes.js")(app);

// this will attach the logged in user to req.user
const JWT_SECRET = process.env.JWT_SECRET || "verySecret$%#$%@#!#!$!!";
app.use(jwt({ secret: JWT_SECRET }));

require("./routes/profile.routes.js")(app);

var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("Server is listening on port " + port);
});
