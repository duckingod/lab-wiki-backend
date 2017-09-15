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
module.exports = {
  render: {
    err: (res, status) => err => { console.log(err); res.status(status).send(err.name + ': ' + err.message) }
  },
  date: {
    weeksBetween: weeksBetween,
    daysAfter: daysAfter
  }
}
