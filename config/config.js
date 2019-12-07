const {
  MONGODB_URI,
  JWT_SECRET,
  FB_CLIENT_ID,
  FB_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET
} = process.env;

exports.config = {
  db: MONGODB_URI,
  auth: {
    jwtSecret: JWT_SECRET,
    facebook: {
      clientId: FB_CLIENT_ID,
      clientSecret: FB_CLIENT_SECRET
    },
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET
    },
    twitter: {
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET
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
