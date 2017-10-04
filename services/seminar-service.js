'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
const {Seminar} = require('../models')

const main = () => Seminar.addNextSeminars()

module.exports = weekly(genesis, main)
