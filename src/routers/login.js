'use strict'

const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const GoogleAuth = require('google-auth-library')
const {oauthClientId} = require('../config').google
const {expirePeriod, emailDomain} = require('../config').permission
const Model = require('../models').News
const role = require('./model')(Model).role
const {jwtKey} = require('../config')
const {error} = require('../utils')

function cookieJwt (credential) {
  return expressJwt({
    secret: jwtKey,
    credentialsRequired: credential,
    getToken: req => { return req.cookies.token }
  })
}

var auth = new GoogleAuth()
var googleOauthClient = new auth.OAuth2(oauthClientId, '', '')

module.exports = {
  checkLogin: cookieJwt(false),
  forceLogin: cookieJwt(true),
  emailDomain: (req, res, next) => {
    if (req.user.email.endsWith(emailDomain)) {
      next()
    } else if (req.user.email === 'julia811021@gmail.com') {
      next()
    } else {
      res.status(403).send('AuthenticationError: invalid email domain')
    }
  },
  simpleLoginWeb: user => require('./fake-fe.js')(oauthClientId, user),
  googleIdTokenLogin: function (req, res) {
    var token = req.body.id_token
    googleOauthClient.verifyIdToken(
        token,
        oauthClientId,
        function (e, login) {
          if (login != null) {
            var payload = login.getPayload()
            var userData = {
              name: payload.name,
              email: payload.email
            }
            var clientToken = jwt.sign(userData, jwtKey, {expiresIn: 60 * 60 * expirePeriod})
            res.cookie('token', clientToken).send('ok')
            console.log(payload.name + ' (' + payload.email + ') logined')
            return
          }
          console.log('login failed')
          res.status(401).send(JSON.stringify(e))
        }
     )
  },
  logout: function (req, res) {
    console.log(req.user.name + ' logout')
    res.clearCookie('token').send('ok')
  },
  userInfo: (req, res) => {
    if (req.user) {
      res.status(200).send({
        name: req.user.name,
        email: req.user.email,
        role: role(req.user, null)
      })
    } else {
      res.status(200).send({
        role: role(req.user, null)
      })
    }
  },
  unauthorizedError: error.handle('UnauthorizedError', 401, res => res.clearCookie('token'))
}
