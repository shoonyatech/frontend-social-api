var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");

mongoose.Promise = global.Promise;

var app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig =
  "mongodb://heroku_3081l80l:3l7ktq47li2pf9qbf5rbjvfmg2@ds119969.mlab.com:19969/heroku_3081l80l";

mongoose
  .connect(process.env.MONGODB_URI || dbConfig, {
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
  res.status(200).json({ message: "Welcome to Wild Sightings API! v1" });
});

require("./routes/profile.routes.js")(app);

var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("Server is listening on port " + port);
});
