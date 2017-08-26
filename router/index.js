var login = require('./login');
var model = require('./model');
var models = require('../models');


module.exports = function(app) {
  app.post('/login', login.googleIdTokenLogin);  
  app.get('/', login.checkUser, (req, res) => { res.send(login.simpleLoginWeb(req.user)); });
  app.use(login.unloginError);
  models = [models.Seminar, models.News, models.Slide];
  for (m of models) {
      app.get(model.route(m), login.forceUser, model.get(m));
      app.post(model.route(m), login.forceUser, model.new(m));
      app.post(model.idRoute(m), login.forceUser, model.update(m));
  }
};
