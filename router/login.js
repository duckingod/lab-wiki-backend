var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var crypto = require('crypto');
var GoogleAuth = require('google-auth-library');
var clientId = require('./config').googleOauthClientId;
var loginPeriod = require('./config').loginExpirePeriod;
var emailDomain = require('./config').validEmailDomain;

jwt_key = crypto.randomBytes(256);
function cookieJwt(credential) {
  return expressJwt({
    secret: jwt_key,
    credentialsRequired: credential,
    getToken: req => { return req.cookies.token; }
  });
}

var auth = new GoogleAuth;
var googleOauthClient = new auth.OAuth2(clientId, '', '');

module.exports = {
    checkLogin: cookieJwt(false),
    forceLogin: cookieJwt(true),
    emailDomain: (req, res, next) => {
        if (req.user.email.endsWith(emailDomain))
          next()
        else
          res.status(403).send("AuthenticationError: invalid email domain")
      },
    simpleLoginWeb: function (user) {
        return require('./fake-fe.js')(clientId, user)
      },
    googleIdTokenLogin: function(req, res) {  
      var token = req.body.id_token;
      googleOauthClient.verifyIdToken(
          token,
          clientId,
          function(e, login) {
            if (login!=null) {
              var payload = login.getPayload();
              var userData = {
                name: payload.name,
                email: payload.email,
                account: payload.email[0]
              };
              var clientToken = jwt.sign(userData, jwt_key, {expiresIn: 60*60*loginPeriod});
              res.cookie('token', clientToken).send("ok");
              console.log(payload.name+" ("+payload.email+") logined");
              return;
            }
            console.log("login failed");
            res.status(401).send(JSON.stringify(e));
          });
      },
    logout: function(req, res) {
      res.clearCookie('token').send('');
      },
    unauthorizedError: function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          res.status(401).clearCookie('token').send(JSON.stringify(err));
        }
      },
}
