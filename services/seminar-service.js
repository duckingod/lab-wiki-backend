'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
const {Seminar} = require('../models')

const main = () =>
  Seminar.nextSeminars().then(seminars => {
    for (let seminar of seminars) {
      Seminar.create(seminar)
        .then(s => console.log('Auto added seminar: ' + s.presenter))
        .catch(console.log)
    }
  })

module.exports = weekly(genesis, main)
