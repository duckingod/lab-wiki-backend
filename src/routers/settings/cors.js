const cors = require('cors')
const {webAppUrl} = require('../../config')

let corsOptionDelegate = (req, callback) => {
  var corsOptions
  if (webAppUrl.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: webAppUrl,
      allowedHeaders: [
        'X-Requested-With'
      ],
      credentials: true
    }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}
module.exports = cors(corsOptionDelegate)
