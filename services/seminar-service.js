'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
// const {Seminar} = require('../models')

const main = () =>
  false
  // Seminar.addNextSeminars()

module.exports = weekly(genesis, main)
