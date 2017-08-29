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
  app.get('/login', (req, res) => { console.log("get login.."); res.send('123');});
  app.post('/login', login.googleIdTokenLogin);  
  app.get('/', login.checkUser, (req, res) => { res.send(login.simpleLoginWeb(req.user)); });
  models = [models.Seminar, models.News, models.Slide];
  for (m of models) {
      app.delete(model.idRoute(m), login.forceUser, model.update(m));
      app.get(model.route(m), login.forceUser, model.get(m));
      app.post(model.route(m), login.forceUser, model.new(m));
      app.post(model.idRoute(m), login.forceUser, model.update(m));
  }
  app.use(login.unloginError);
};
