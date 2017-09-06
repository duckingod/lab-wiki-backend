var session = require('express-session');
var crypto = require('crypto');
key = crypto.randomBytes(256);

// app.set('trust proxy', 1) // trust first proxy
setting = {
  secret: key,
  name: 'H3e3_i5_5355I0N_ID',
  resave: true,
  saveUninitialized:false
}
module.exports = session(setting)

