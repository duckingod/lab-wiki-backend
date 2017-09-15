'use strict'

const {System, Seminar} = require('../models')
const {err} = require('../utils').render

module.exports = {
  advance: (req, res) =>
    System.change(config => { config.seminarIdOffset -= 1 })
      .then(c => res.send('ok'))
      .catch(err(res, 503)),
  postpone: (req, res) =>
    System.change(config => { config.seminarIdOffset += 1 })
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
}
