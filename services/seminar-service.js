'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
const {preaddWeeks} = require('../config').seminarService
const {Seminar, ContactList, System} = require('../models')
const {daysAfter} = require('../utils').date

const main = () => {
  Promise.all([
    ContactList.dutyWithDate('seminarId', {nRound: 1, nSchedule: 2, group: 2}),
    System.load()
  ]).then(res => {
    let schedule = res[0]
    let weekday = res[1].seminarWeekday
    for (let presentation of schedule) {
      Seminar.create(
        {
          presenter: presentation.contact.name,
          owner: presentation.contact.account,
          date: daysAfter(presentation.date, preaddWeeks * 7 + weekday),
          topic: '.'
        }
      )
        .then(console.log)
        .catch(console.log)
    }
  })
}

module.exports = weekly(genesis, main)
