'use strict'

const {System, Seminar} = require('../models')
const {error} = require('../utils')
// const {genesis} = require('../config')

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
      res.status(501).send('seminar scheduling not implemented: should post with id list, initial date'),
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
