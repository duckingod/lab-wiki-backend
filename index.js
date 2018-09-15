const startServerFlag = '--start-nodemon-server'
let flagIndex = process.argv.indexOf(startServerFlag)
if (flagIndex > -1) {
  // wrapper for nodemon
  process.argv.splice(flagIndex, 1)
  require('nodemon')({
    script: './index.js',
    args: process.argv.slice(2)
  })
} else {
  const run = require('./src/server')
  run()
}
