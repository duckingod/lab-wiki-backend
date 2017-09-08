var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var models = require('./models')
require('./services')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

require('./routers')(app)
var server

models.sequelize.sync().then()

console.log('Express server listening on port 3000')
server = app.listen(3000)

module.exports = server

