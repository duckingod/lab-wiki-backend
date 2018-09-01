'use strict'

const express = require('express')
const models = require('./models')
let {port} = require('./config')
const {alter} = require('./config').service.database
const services = require('./services')
const routers = require('./routers')

var program = require('commander')

const startServer = async () => {
  program
    .version(require('../package.json').version)
    .option('-p, --port [port]', 'port of server [port]')
    .parse(process.argv)

  await models.sequelize.sync({ alter: alter })
  await models.System.load()

  let app = express()

  services()
  app.use(routers())

  port = program.port || port

  console.log('Express server listening on port ' + String(port))
  var server = app.listen(port)

  return server
}

module.exports = startServer
