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
  out.message = err.mesage
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
    daysAfter: daysAfter
  },
  model: {
    modifyRecords: modifyRecords,
    updateRecords: updateRecords
  }
}
