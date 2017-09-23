'use strict'

const {System, Seminar} = require('../models')
const {error} = require('../utils')
const {daysAfter} = require('../utils').date
const {modifyRecords, updateRecords} = require('../utils').model
// const {genesis} = require('../config')

const futureSeminars = () =>
  Seminar.findAll({ where: { date: { $gte: new Date() } } })
/*
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
 */

module.exports = {
  seminar: {
    postpone: (req, res) =>
      res.status(501).send('seminar postpone not implemented: should pass date'),
    /*
    postpone: (req, res) =>
      futureSeminars()
        .then(modifyRecords(seminar => { seminar.date = daysAfter(seminar.date, 7) }))
        .then(updateRecords)
        .then(() => System.change(config => { config.seminarIdOffset += 2 }))
        .then(c => res.send('ok'))
        .catch(error.send(res, 503)),
     */
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
      res.status(501).send('swap seminars not implemented: should post with date1, date2')
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
