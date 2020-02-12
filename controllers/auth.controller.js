const axios = require("axios");
let OAuth = require("oauth");
let timestamp = require("unix-timestamp");
let oauthSignature = require("oauth-signature");
let profileController = require("./profile.controller");
const authConfig = process.env.AUTH_DATA
  ? JSON.parse(process.env.AUTH_DATA)
  : {};
// Create and Save a new user
exports.fbSignin = (req, res) => {
  console.log("Attempting Facebook login");
  axios
    .post(
      "https://graph.facebook.com/v5.0/oauth/access_token",
      {
        client_id: authConfig.facebook.clientId,
        client_secret: authConfig.facebook.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri
      },
      { "Content-Type": "application/json" }
    )
    .then(function(response) {
      let authResponse = response.data;
      axios
        .get(
          "https://graph.facebook.com/v5.0/me?fields=id,name,email,picture.type(large)",
          {
            params: { access_token: authResponse.access_token }
          }
        )
        .then(function(response) {
          const user = response.data;
          profileController.findSocialAuthUserinDB(
            "facebook",
            user,
            res,
            authResponse
          );
        });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({});
    });
};

function parseQueryString(str) {
  let obj = {};
  let key;
  let value;
  (str || "").split("&").forEach(keyValue => {
    if (keyValue) {
      value = keyValue.split("=");
      key = decodeURIComponent(value[0]);
      obj[key] = !!value[1] ? decodeURIComponent(value[1]) : true;
    }
  });
  return obj;
}

exports.githubSignin = (req, res) => {
  console.log("Attempting Github login");
  axios
    .post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: authConfig.github.clientId,
        client_secret: authConfig.github.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri,
        state: req.body.state,
        grant_type: "authorization_code"
      },
      { "Content-Type": "application/json" }
    )
    .then(function(response) {
      let authResponse = parseQueryString(response.data);
      if (authResponse.error) {
        res.status(500).json({ error: authResponse.error });
      } else {
        axios
          .get("https://api.github.com/user", {
            headers: { Authorization: "Bearer " + authResponse.access_token }
          })
          .then(function(response) {
            const user = response.data;
            profileController.findSocialAuthUserinDB(
              "github",
              user,
              res,
              authResponse
            );
          });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
};

oauthService = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  authConfig.twitter.clientId,
  authConfig.twitter.clientSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
);

exports.twitterSignin = (req, res) => {
  console.log("Attempting Twitter login");
  if (!req.body.oauth_token) {
    oauthService.getOAuthRequestToken(
      { oauth_callback: req.body.redirectUri },
      function(error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          res.status(500).json(error);
        } else {
          res.json({
            oauth_token: oauthToken,
            oauth_token_secret: oauthTokenSecret
          });
        }
      }
    );
  } else {
    oauthService.getOAuthAccessToken(
      req.body.oauth_token,
      null,
      req.body.oauth_verifier,
      function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          res.status(500).json(error);
        } else {
          let verifyCredentialsUrl =
            "https://api.twitter.com/1.1/account/verify_credentials.json";
          let parameters = {
            oauth_consumer_key: authConfig.twitter.clientId,
            oauth_token: oauthAccessToken,
            oauth_nonce: "vueauth-" + new Date().getTime(),
            oauth_timestamp: timestamp.now(),
            oauth_signature_method: "HMAC-SHA1",
            oauth_version: "1.0"
          };

          let signature = oauthSignature.generate(
            "GET",
            verifyCredentialsUrl,
            parameters,
            authConfig.twitter.clientSecret,
            oauthAccessTokenSecret
          );

          axios
            .get(
              "https://api.twitter.com/1.1/account/verify_credentials.json",
              {
                headers: {
                  Authorization:
                    "OAuth " +
                    'oauth_consumer_key="' +
                    authConfig.twitter.clientId +
                    '",' +
                    'oauth_token="' +
                    oauthAccessToken +
                    '",' +
                    'oauth_nonce="' +
                    parameters.oauth_nonce +
                    '",' +
                    'oauth_timestamp="' +
                    parameters.oauth_timestamp +
                    '",' +
                    'oauth_signature_method="HMAC-SHA1",' +
                    'oauth_version="1.0",' +
                    'oauth_signature="' +
                    signature +
                    '"'
                }
              }
            )
            .then(function(response) {
              const user = response.data;
              const authResponse = {
                access_token: oauthAccessToken,
                access_token_secret: oauthAccessTokenSecret
              };
              profileController.findSocialAuthUserinDB(
                "twitter",
                user,
                res,
                authResponse
              );
            })
            .catch(function(err) {
              console.log(err);
              res.status(500).json(err.response.data.errors);
            });
        }
      }
    );
  }
};
