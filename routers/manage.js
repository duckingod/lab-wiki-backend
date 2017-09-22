'use strict'

const {System, Seminar, ContactList} = require('../models')
const {error} = require('../utils')
const {daysAfter, weeksBetween} = require('../utils').date
const {modifyRecords, updateRecords} = require('../utils').model
const {genesis} = require('../config')

const futureSeminars = () =>
  Seminar.findAll({ where: { date: { $gte: new Date() } } })

const schedule = (by, startDate, idList) => {
  let weeks = weeksBetween(genesis, startDate)
  return ContactList.all()
    .then(contacts => {
      for (let contact of contacts) {
        contact[by] = 0
      }
      for (let i in idList) {
        contacts[idList[i]][by] = (i + weeks) % idList.length
      }
      return updateRecords(contacts)
    })
}

module.exports = {
  seminar: {
    advance: (req, res) =>
      Seminar.addNextSeminars()
        .then(() => futureSeminars())
        .then(modifyRecords(seminar => { seminar.date = daysAfter(seminar.date, -7) }))
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarIdOffset -= 2 }))
        .then(() => Seminar.addNextSeminars())
        .then(c => res.send('ok'))
        .catch(error.send(res, 503)),
    postpone: (req, res) =>
      futureSeminars()
        .then(modifyRecords(seminar => { seminar.date = daysAfter(seminar.date, 7) }))
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarIdOffset += 2 }))
        .then(c => res.send('ok'))
        .catch(error.send(res, 503)),
    weekday: (req, res) =>
      Promise.all([
        futureSeminars(),
        System.load()
      ])
        .then(res =>
          modifyRecords(seminar => {
            seminar.date = daysAfter(seminar.date, req.body.weekday - res[1].seminarWeekday)
          }
          )(res[0])
        )
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarWeekday = req.body.weekday }))
        .then(c => res.send('ok'))
        .catch(error.send(res, 503)),
    next: (req, res) =>
      Seminar.nextSeminars()
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    schedule: (req, res) => {
      schedule('seminarId', req.body.date, req.body.list)
        .then(contacts => res.send(contacts))
        .catch(error.send(res, 503))
    }
  },
  garbage: {
    advance: (req, res) =>
      System.change(config => { config.garbageIdOffset -= 1 })
        .then(c => res.send('ok'))
        .catch(error.send(res, 503)),
    postpone: (req, res) =>
      System.change(config => { config.garbageIdOffset += 1 })
        .then(c => res.send('ok'))
        .catch(error.send(res, 503))
  }
}
