'use strict'

const {Seminar, ContactList} = require('../models')
const {error, listify} = require('../utils')
const takeOutGarbage = require('./take-out-garbage')

module.exports = {
  seminar: {
    postpone: (req, res) =>
      Seminar.postpone(req.body.id)
        .then(seminars => res.send(seminars))
        .catch(error.send(res, 400)),
    weekday: (req, res) =>
      Seminar.setWeekday(req.body.date, req.body.weekday)
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    schedule: (req, res) =>
      Seminar.reschedule(listify(req.body.idList, Number), new Date(req.body.date))
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    swap: (req, res) =>
      Seminar.swap(req.body.id1, req.body.id2)
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    next: (req, res) =>
      Seminar.futureSeminars(new Date())
        .then(s => res.send(s))
        .catch(error.send(res, 503)),
    addFuture: (req, res) =>
      Seminar.addFutureSeminars(new Date())
        .then(s => res.send(s))
        .catch(error.send(res, 503))
  },
  garbage: {
    schedule: (req, res) =>
      ContactList.setScheduleId('garbage', listify(req.body.idList, Number), new Date(req.body.date), 1)
        .then(() => takeOutGarbage(req, res))
  }
}
