var login = require('./login');
var model = require('./model');
var models = require('../models');
var cors = require('cors')
var appUrl = require('./config').appUrl

corsOptionDelegate = (req, callback) => {
  var corsOptions;
  if (appUrl.indexOf(req.header('Origin')) !== -1 ) {
    corsOptions = {
      origin: appUrl,
      allowedHeaders: [
        'X-Requested-With'
      ],
      credentials: true,
    }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

module.exports = function(app) {
  app.use(cors(corsOptionDelegate))
  app.post('/login', login.googleIdTokenLogin);
  app.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)); });
  app.get('/loginfail', login.forceLogin);
  models = [models.Seminar, models.News, models.Slide];
  emailLogin = [login.forceLogin, login.emailDomain]
  for (m of models) {
    m = model(m)
    app.get(    m.route,   emailLogin, m.index)
    app.post(   m.route,   emailLogin, m.new)
    app.delete( m.idRoute, emailLogin, m.record, m.owner, m.delete)
    app.post(   m.idRoute, emailLogin, m.record, m.owner, m.update)
  }
  app.use(login.unauthorizedError);
};
