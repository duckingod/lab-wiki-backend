'use strict'

const weekly = require('./weekly')

const main = () => {
  const {exec} = require('child_process')
  exec('src/tools/db-backup', (err, stdout, stderr) => { console.log(stdout) })
}

module.exports = {
  start: () => weekly(0, main)
}
