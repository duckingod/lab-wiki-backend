'use strict'

var commander = require('commander')
const setup = require('./setup')
const startServer = async args => {
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

const actions = { start: startServer, setup: setup }
const main = () => {
  commander
    .version(require('../package.json').version)
    .arguments('<cmd>')
    .option('-p, --port [port]', 'port of server [port]')
    .option('-b, --backup', 'backup old config when install')
    .option('-o, --overwrite', 'overwrite old config when install')
    .action(cmd => actions[cmd](commander))
    .parse(process.argv)
}

module.exports = main
