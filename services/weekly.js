'use strict'

function weeksBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return parseInt((endDate.getTime() - startDate.getTime()) / millisecondsPerDay / 7)
}
function daysAfter (date, n) {
  let d = new Date(date)
  d.setDate(date.getDate() + n)
  return d
}

module.exports = (startFrom, callback, options) => {
  let startDate = new Date(startFrom)
  let now = new Date()
  startDate = daysAfter(startDate, weeksBetween(startDate, now) * 7)
  let startOffset = startDate.getTime() - now.getTime()
  let week = 1000 * 60 * 60 * 24 * 7

  if (options && options.instant === true) {
    callback()
  }
  setTimeout(() =>
    setInterval(callback, week),
    startOffset
  )
}
