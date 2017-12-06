'use strict'

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express')
const {webAppUrl} = require('../../config')

module.exports = () => {
  let router = express.Router()
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))
  router.use(cookieParser())
  router.use(require('./session'))
  if (webAppUrl == null) {
    router.use(require('./history')) // redirects all GET excepts /api to index.html
    router.use(express.static('./static'))
  } else {
    router.use(require('./cors'))
  }
  return router
}
