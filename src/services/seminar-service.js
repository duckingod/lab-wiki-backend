'use strict'

const weekly = require('./weekly')
const {Seminar, System} = require('../models')
const {days} = require('../utils').date
const {email} = require('../utils')
const moment = require('moment')

const main = async () => {
  let seminars = await Seminar.nextWeekSeminars()
  let content = { presenters: [], dates: [] }
  for (let s of seminars) {
    content.presenters.push(s.presenter)
    content.dates.push(moment(s.date))
  }
  email.send('seminar-reminder-email', content, ['seminar'])

  Seminar.addFutureSeminars(new Date())
  console.log('Added future seminars')
}

let seminarWeekdayPlusOne = async () => days(await System.load().seminarWeekday + 1)

module.exports = weekly(seminarWeekdayPlusOne, main, {instant: true})
