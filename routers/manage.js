'use strict'

const {System, Seminar} = require('../models')
const {err} = require('../utils').render
const {daysAfter} = require('../utils').date
const {modifyRecords, updateRecords} = require('../utils').model

const futureSeminars = () =>
  Seminar.findAll({ where: { date: { $gte: new Date() } } })

module.exports = {
  seminar: {
    advance: (req, res) => {
      Seminar.addNextSeminars()
        .then(() => futureSeminars())
        .then(modifyRecords(seminar => { seminar.date = daysAfter(seminar.date, -7) }))
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarIdOffset -= 2 }))
        .then(() => Seminar.addNextSeminars())
        .then(c => res.send('ok'))
        .catch(err(res, 503))
    },
    postpone: (req, res) =>
      futureSeminars()
        .then(modifyRecords(seminar => { seminar.date = daysAfter(seminar.date, 7) }))
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarIdOffset += 2 }))
        .then(c => res.send('ok'))
        .catch(err(res, 503)),
    weekday: (req, res) =>
      System.change(config => { config.seminarWeekday = req.params.weekday })
        .then(c => res.send('ok'))
        .catch(err(res, 503)),
    next: (req, res) =>
        Seminar.nextSeminars()
          .then(s => res.send(s))
          .catch(err(res, 503))
  },
  garbage: {
    advance: (req, res) =>
      System.change(config => { config.garbageIdOffset -= 1 })
        .then(c => res.send('ok'))
        .catch(err(res, 503)),
    postpone: (req, res) =>
      System.change(config => { config.garbageIdOffset += 1 })
        .then(c => res.send('ok'))
        .catch(err(res, 503))
  }
}
