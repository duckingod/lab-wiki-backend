var cors = require('cors')
var appUrl = require('../config').appUrl

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
module.exports = cors(corsOptionDelegate)
