'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
const {Seminar, System} = require('../models')
const {days} = require('../utils')

const main = () => {
  Seminar.addFutureSeminars(new Date())
}

let seminarWeekdayPlusOne = async () => days(await System.load().seminarWeekday + 1)

module.exports = weekly(seminarWeekDayPlusOne, main)

