var login = require('./login');
var model = require('./model');
var models = require('../models');

module.exports = function(app) {
  app.post('/login', login.googleIdTokenLogin);  
  app.get('/', login.checkUser, (req, res) => { res.send(login.simpleLoginWeb(req.user)); });
  app.use(login.unloginError);
  app.get('/seminar', model.get(models.Seminar));
};
