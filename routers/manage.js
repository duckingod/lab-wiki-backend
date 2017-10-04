'use strict'

const {System, Seminar} = require('../models')
const {error} = require('../utils')
const {daysAfter} = require('../utils').date
const {modifyRecords, updateRecords} = require('../utils').model
// const {genesis} = require('../config')

const futureSeminars = () =>
  Seminar.findAll({ where: { date: { $gte: new Date() } } })

module.exports = {
  seminar: {
    postpone: (req, res) =>
      Seminar.postpone(req.body.id)
        .then(seminars => res.send(seminars))
        .catch(error.send(res, 400)),
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
    schedule: (req, res) =>
      res.status(501).send('seminar scheduling not implemented: should post with id list, initial date'),
    swap: (req, res) =>
      Seminar.swap(req.body.seminar1Id, req.body.seminar2Id)
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    next: (req, res) =>
      Seminar.nextSeminars(new Date())
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    addFuture: (req, res) =>
      Seminar.nextSeminars(new Date()).then(updateRecords)
        .then(s => res.send(s))
        .catch(error.send(res, 503))
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
