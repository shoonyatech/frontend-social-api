var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
var jwt = require("express-jwt");
var compression = require("compression");
require("dotenv").config();
mongoose.Promise = global.Promise;

const { MONGODB_URI, JWT_SECRET, PORT = 3000 } = process.env;
let app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(compression());


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('test-event', () => {
    console.log('test-event');
    io.emit('test-reply', 'reply');
  });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

/*  heartbeat
 */
app.get("/", function (req, res) {
  res.status(200).json({ message: "Welcome to Frontend Social API! v1" });
});

require("./routes/auth.routes.js")(app);
require("./routes/job-read.routes.js")(app);
require("./routes/city.routes.js")(app);
require("./routes/event-read.routes.js")(app);
require("./routes/article-read.routes.js")(app);
require("./routes/tool-read.routes.js")(app);
require("./routes/skill.routes.js")(app);
require("./routes/newsletter.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/comment-read.routes.js")(app);
require("./routes/meeting-read.routes.js")(app);
require("./routes/course-read.routes.js")(app);
require("./routes/user-page-read.routes.js")(app);
require("./routes/blog-read.routes.js")(app);
require("./routes/challenge-read.routes.js")(app);
require("./routes/submission-read.routes.js")(app);
require("./routes/vlog-read.routes.js")(app);
require("./routes/tip-read.routes.js")(app);
require("./routes/feedback.routes.js")(app);

// this will attach the logged in user to req.user
app.use(jwt({ secret: JWT_SECRET, algorithms: ["HS256"] }));

require("./routes/job-write.routes.js")(app);
require("./routes/event-write.routes.js")(app);
require("./routes/article-write.routes.js")(app);
require("./routes/tool-write.routes.js")(app);
require("./routes/profile.routes.js")(app);
require("./routes/comment-write.routes.js")(app);
require("./routes/vote-write.routes.js")(app);
require("./routes/vote-read.routes.js")(app);
require("./routes/user-page-write.routes.js")(app);
require("./routes/user-activity.routes.js")(app);
require("./routes/meeting-write.routes.js")(app);
require("./routes/course-write.routes.js")(app);
require("./routes/blog-write.routes.js")(app);
require("./routes/challenge-write.routes.js")(app);
require("./routes/submission-write.routes.js")(app);
require("./routes/reward-points-write.routes.js")(app);
require("./routes/vlog-write.routes.js")(app);
require("./routes/tip-write.routes.js")(app);

http.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
