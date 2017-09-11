const login = require('./login')
const model = require('./model')
const models = require('../models')
const gpuUsage = require('./gpu-usage')
const cfpSearch = require('./cfp-search')
const takeOutGarbage = require('./take-out-garbage')
const express = require('express')

function apiRoute () {
  let api = express.Router()

  let emailLogin = [login.forceLogin, login.emailDomain]
  api.post('/login', login.googleIdTokenLogin)
  api.post('/logout', emailLogin, login.logout)
  api.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)) })

  let _models = [models.Seminar, models.News, models.Slide, models.ContactList, models.Conference, models.EMail]
  for (let m of _models) {
    let args = {}
    if (m.name === 'EMail') args.route = 'emailSchedule'

    m = model(m, args)

    api.get(m.route, emailLogin, m.index)
    api.post(m.route, emailLogin, m.creatable, m.new)
    api.delete(m.idRoute, emailLogin, m.record, m.editable, m.delete)
    api.post(m.idRoute, emailLogin, m.record, m.editable, m.update)
  }
  api.get('/workstations', emailLogin, gpuUsage)
  api.get('/takeOutGarbage', emailLogin, takeOutGarbage)
  api.get('/cfpSearch', emailLogin, cfpSearch)
  api.get('/user', login.checkLogin, login.userInfo)
  api.get('/garbageD', (req, res) => models.ContactList.garbageDuty().then(res.send))
  return api
}

function frontEndRoute () {
  let fe = express.Router()
  fe.use(express.static('static'))
  return fe
}

module.exports = function (app) {
  app.use(require('./settings/cors'))
  app.use(require('./settings/session'))
  // app.use(require('helmet'))

  app.use(frontEndRoute())
  app.use('/api', apiRoute())

  app.use(login.unauthorizedError)
}
