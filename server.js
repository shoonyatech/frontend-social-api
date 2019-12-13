let express = require("express");
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
let cors = require("cors");
let jwt = require("express-jwt");
let config = require("./config/config").config;
require("dotenv").config();

mongoose.Promise = global.Promise;

let app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(config.db, {
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
require("./routes/city.routes.js")(app);
require("./routes/conference.routes.js")(app);
require("./routes/article.routes.js")(app);

// this will attach the logged in user to req.user
app.use(jwt({ secret: config.auth.jwtSecret }));

require("./routes/profile.routes.js")(app);

let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;
  console.log("Server is listening on port " + port);
});
