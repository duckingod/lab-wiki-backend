'use strict'

const express = require('express')
const models = require('./models')
const {port} = require('./config')
const services = require('./services')
const routers = require('./routers')

const startServer = async () => {
  await models.sequelize.sync({ alter: true })
  await models.System.load()

  let app = express()

  services()
  app.use(routers())

  console.log('Express server listening on port ' + String(port))
  var server = app.listen(port)

  return server
}

module.exports = startServer
