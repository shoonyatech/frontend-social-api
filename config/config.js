let keys = require("./keys").keys;

exports.config = {
  db: process.env.MONGODB_URI || keys.mongodb,
  auth: {
    jwtSecret: process.env.JWT_SECRET || keys.jwtSecret,
    facebook: {
      clientId: process.env.FB_CLIENT_ID || keys.facebook.clientId,
      clientSecret: process.env.FB_CLIENT_SECRET || keys.facebook.clientSecret
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || keys.github.clientId,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || keys.github.clientSecret
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID || keys.twitter.clientId,
      clientSecret:
        process.env.TWITTER_CLIENT_SECRET || keys.twitter.clientSecret
    },
    bitbucket: {
      clientId: "",
      clientSecret: ""
    },
    linkedin: {
      clientId: "",
      clientSecret: ""
    }
  }
};
