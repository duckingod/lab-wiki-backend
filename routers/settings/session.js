let session = require('express-session')
let crypto = require('crypto')
let key = crypto.randomBytes(256)

// app.set('trust proxy', 1) // trust first proxy
let setting = {
  secret: key,
  name: 'H3e3_i5_5355I0N_ID',
  resave: true,
  saveUninitialized: false
}
module.exports = session(setting)
