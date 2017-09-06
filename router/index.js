const login = require('./login')
const model = require('./model')
const models = require('../models')
const gpuUsage = require('./gpu-usage')
const takeOutGarbage = require('./take-out-garbage')
const express = require('express')

function apiRoute() {
  let api = express.Router()

  emailLogin = [login.forceLogin, login.emailDomain]
  api.post('/login', login.googleIdTokenLogin)
  api.post('/logout', emailLogin, login.logout)
  api.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)) })

  _models = [models.Seminar, models.News, models.Slide, models.ContactList]
  for (m of _models) {
    m = model(m)
    api.get(    m.route,   emailLogin, m.index)
    api.post(   m.route,   emailLogin, m.new)
    api.delete( m.idRoute, emailLogin, m.record, m.editable, m.delete)
    api.post(   m.idRoute, emailLogin, m.record, m.editable, m.update)
  }
  api.get('/gpuUsage', emailLogin, gpuUsage)
  api.get('/takeOutGarbage', emailLogin, takeOutGarbage)
  api.get('/user', login.checkLogin, login.userInfo)
  return api
}

module.exports = function(app) {
  app.use(require('./settings/cors'))
  app.use(require('./settings/session'))
  //app.use(require('helmet'))
  
  app.use('/api', apiRoute())

  app.use(login.unauthorizedError)
};
