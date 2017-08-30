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
  for (m of models) {
      app.get(   model.route(m),   login.forceLogin, login.emailDomain, model.get(m));
      app.post(  model.route(m),   login.forceLogin, login.emailDomain, model.new(m));
      app.delete(model.idRoute(m), login.forceLogin, login.emailDomain, model.delete(m));
      app.post(  model.idRoute(m), login.forceLogin, login.emailDomain, model.update(m));
  }
  app.use(login.unauthorizedError);
};
