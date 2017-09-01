var login = require('./login');
var model = require('./model');
var models = require('../models');


module.exports = function(app) {
  app.use(require('./settings/cors'))
  app.use(require('./settings/session'))
  app.use(require('helmet'))

  app.post('/login', login.googleIdTokenLogin)
  app.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)) })
  app.get('/loginfail', login.forceLogin)
  models = [models.Seminar, models.News, models.Slide]
  emailLogin = [login.forceLogin, login.emailDomain]
  for (m of models) {
    m = model(m)
    app.get(    m.route,   emailLogin, m.index)
    app.post(   m.route,   emailLogin, m.new)
    app.delete( m.idRoute, emailLogin, m.record, m.owner, m.delete)
    app.post(   m.idRoute, emailLogin, m.record, m.owner, m.update)
  }
  app.use(login.unauthorizedError)
};
