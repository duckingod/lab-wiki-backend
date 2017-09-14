const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const models = require('./models')
const {port} = require('./config')

require('./utils')
require('./services')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

require('./routers')(app)
var server

models.sequelize.sync().then()

console.log('Express server listening on port ' + String(port))
server = app.listen(port)

module.exports = server
