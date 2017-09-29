'use strict'

function weeksBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return parseInt((endDate.getTime() - startDate.getTime()) / millisecondsPerDay / 7)
}
function daysAfter (date, n) {
  let d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function sameWeek (date1, date2) {
  let {genesis} = require('../config')
  let d = new Date(genesis)
  return weeksBetween(d, date1) === weeksBetween(d, date2)
}

function modifyRecords (operation) {
  return (records) => {
    let promises = []
    for (let r of records) {
      if (!r) { continue }
      promises.push(new Promise((resolve, reject) => {
        operation(r)
        resolve(r)
      }))
    }
    return Promise.all(promises)
  }
}
function updateRecords (records) {
  let promises = []
  for (let r of records) {
    if (!r) { continue }
    promises.push(r.save())
  }
  return Promise.all(promises)
}

function prettyError (err) {
  let out = {}
  out.name = err.name
  out.message = err.message
  if (err.errors != null) {
    out.errors = []
    for (let e of err.errors) {
      let _out = {}
      for (let k in e) {
        if (!k.startsWith('__') && typeof e[k] !== 'object') {
          _out[k] = e[k]
        }
      }
      out.errors.push(_out)
    }
  }
  return out
}

module.exports = {
  error: {
    pretty: prettyError,
    send: (res, status) => err =>
      res.status(status).send(prettyError(err)),
    handle: (errName, status, cb = r => r) =>
      (err, req, res, next) =>
        err.name === errName
          ? cb(res).status(status).send(prettyError(err))
          : next(err)
  },
  date: {
    weeksBetween: weeksBetween,
    daysAfter: daysAfter,
    sameWeek: sameWeek
  },
  model: {
    modifyRecords: modifyRecords,
    updateRecords: updateRecords
  },
  const: {
    event: {
      seminar: {
        swap: 'seminar swap',
        skip: 'seminar postpone'
      },
      garbage: {
        skip: 'garbage postpone'
      }
    }
  },
  schedule: {
    dutyProp: by => {
      let {skip} = require('../utils').const.event[by]
      let args = { where: {}, order: [by + 'Id'] }
      args.where[by + 'Id'] = {$gte: 1}
      return {
        id: by + 'Id',
        offset: by + 'IdOffset',
        event: skip,
        queryArgs: args
      }
    }
  },
  listify: (p1, p2) => {
    let constructor = cb => ary => {
      let out = []
      if (typeof ary === 'number') {
        for (let i = 0; i < ary; i++) {
          out.push(cb(i))
        }
      } else {
        for (let a of ary) {
          out.push(cb(a))
        }
      }
      return out
    }

    if (p2 === undefined) {
      return constructor(p1)
    } else {
      return constructor(p2)(p1)
    }
  }
}
