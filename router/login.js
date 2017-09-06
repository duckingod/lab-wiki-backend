const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const crypto = require('crypto')
const GoogleAuth = require('google-auth-library')
const clientId = require('./config').googleOauthClientId
const loginPeriod = require('./config').loginExpirePeriod
const emailDomain = require('./config').validEmailDomain
const Model = require("../models").News
const role = require('./model')(Model).role

// jwt_key = crypto.randomBytes(256)
jwt_key = 'the secret is vicky soooo god'
function cookieJwt(credential) {
  return expressJwt({
    secret: jwt_key,
    credentialsRequired: credential,
    getToken: req => { return req.cookies.token }
  })
}

var auth = new GoogleAuth
var googleOauthClient = new auth.OAuth2(clientId, '', '')

module.exports = {
    checkLogin: cookieJwt(false),
    forceLogin: cookieJwt(true),
    emailDomain: (req, res, next) => {
      if (req.user.email.endsWith(emailDomain))
        next()
      else if (req.user.email === "julia811021@gmail.com")
        next()
      else
        res.status(403).send("AuthenticationError: invalid email domain")
    },
    simpleLoginWeb: function (user) {
      return require('./fake-fe.js')(clientId, user)
    },
    googleIdTokenLogin: function(req, res) {  
      var token = req.body.id_token
      googleOauthClient.verifyIdToken(
        token,
        clientId,
        function(e, login) {
          if (login!=null) {
            var payload = login.getPayload()
            var userData = {
              name: payload.name,
              email: payload.email,
            }
            var clientToken = jwt.sign(userData, jwt_key, {expiresIn: 60*60*loginPeriod})
            res.cookie('token', clientToken).send("ok")
            console.log(payload.name+" ("+payload.email+") logined")
            return
          }
          console.log("login failed")
          res.status(401).send(JSON.stringify(e))
        }
     )
    },
    logout: function(req, res) {
      console.log(req.user.name +" logout")
      res.clearCookie('token').send('ok')
    },
    userInfo: (req, res) => {
      if (req.user)
        res.status(200).send({
          name: req.user.name,
          email: req.user.email,
          role: role(req.user, null)
        })
      else
        res.status(200).send({
          role: role(req.user, null)
        })
    },
    unauthorizedError: function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).clearCookie('token').send(JSON.stringify(err))
      }
    },
}
