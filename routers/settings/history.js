'use strict'

let history = require('connect-history-api-fallback')
let config = {
  index: 'index.html',
  verbose: true,
  rewrites: [
    {
      from: /^\/api(\/.*)?$/, to: c => c.parsedUrl.pathname
    }
  ]
}
module.exports = history(config)
