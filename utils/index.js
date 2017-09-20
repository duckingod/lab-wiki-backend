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

module.exports = {
  render: {
    err: (res, status) => err => { console.log(err); res.status(status).send(err.name + ': ' + err.message) }
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
