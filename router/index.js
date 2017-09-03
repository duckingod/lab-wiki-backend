var login = require('./login')
var model = require('./model')
var models = require('../models')
var gpuUsage = require('./gpu-usage')


module.exports = function(app) {
  app.use(require('./settings/cors'))
  app.use(require('./settings/session'))
  //app.use(require('helmet'))

  emailLogin = [login.forceLogin, login.emailDomain]
  app.post('/login', login.googleIdTokenLogin)
  app.post('/logout', emailLogin, login.logout)
  app.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)) })

  models = [models.Seminar, models.News, models.Slide, models.ContactList]
  for (m of models) {
    m = model(m)
    app.get(    m.route,   emailLogin, m.index)
    app.post(   m.route,   emailLogin, m.new)
    app.delete( m.idRoute, emailLogin, m.record, m.owner, m.delete)
    app.post(   m.idRoute, emailLogin, m.record, m.owner, m.update)
  }
  app.get('/gpuUsage', emailLogin, gpuUsage)

  app.use(login.unauthorizedError)
};
