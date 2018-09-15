'use strict'

const startServer = async (args = {}) => {
  const express = require('express')
  const models = require('./models')
  let {port} = require('./config')
  const {alter} = require('./config').service.database
  const services = require('./services')
  const routers = require('./routers')

  await models.sequelize.sync({ alter: alter })
  await models.System.load()

  let app = express()

  services()
  app.use(routers())

  port = args.port || port

  console.log('Express server listening on port ' + String(port))
  var server = app.listen(port)

  return server
}
module.exports = startServer
