
var login = require('./controller/login')

module.exports = function(app) {
  app.post('/login', login.googleIdTokenLogin);  
  app.get('/', login.checkUser, (req, res) => { res.send(login.simpleLoginWeb(req.user)); });
  app.use(login.unloginError);
};
