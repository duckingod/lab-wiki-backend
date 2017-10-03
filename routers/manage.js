'use strict'

const {System, Seminar, Event} = require('../models')
const {error, listify} = require('../utils')
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
    postpone: (req, res) => {
      let f = async () => {
        const {dutyProp} = require('../utils').schedule
        let dp = dutyProp('seminar')
        let seminar = await Seminar.findById(req.body.id)
        if (!seminar.placeholder) {
          throw new Error('Cannot postpone a non-placeholder seminar')
        }
        await (new Event({ name: dp.event, meta: seminar.scheduleId })).save()
        let args = {
          where: {
            scheduleId: { $gte: seminar.scheduleId },
            placeholder: { $eq: true }
          }
        }
        let [seminars, newSeminars] = [await Seminar.findAll(args), await Seminar.nextSeminars(seminar.date)]
        await Seminar.destroy(args)
        newSeminars = await updateRecords(listify(
          newSeminars,
          seminar => seminars.find(a => a.scheduleId === seminar.scheduleId) ? seminar : undefined))
        return newSeminars
      }
      f()
        .then(seminars => res.send(seminars))
        .catch(error.send(res, 400))
    },
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
      res.status(501).send('swap seminars not implemented: should post with date1, date2'),
    next: (req, res) =>
      Seminar.nextSeminars(new Date()).then(s => res.send(s)).catch(error.send(res, 503)),
    addFuture: (req, res) =>
      Seminar.nextSeminars(new Date()).then(updateRecords).then(s => res.send(s))
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
