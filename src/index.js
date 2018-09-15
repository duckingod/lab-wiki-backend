'use strict'

var commander = require('commander')
const setup = require('./setup')
const startServer = require('./server')
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
