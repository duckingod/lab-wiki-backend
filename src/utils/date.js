'use strict'

const EPS = 1e-9
const msPerDay = 24 * 60 * 60 * 1000
function weeksBetween (startDate, endDate) {
  return parseInt((endDate.getTime() - startDate.getTime()) / msPerDay / 7)
}
function daysAfter (date, n) {
  let d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function sameWeek (date1, date2) {
  let genesis = new Date(require('../config').genesis)
  return weeksBetween(genesis, date1) === weeksBetween(genesis, date2)
}
function toWeek (date) {
  let genesis = new Date(require('../config').genesis)
  return daysAfter(genesis, weeksBetween(genesis, date) * 7)
}
function weekdayOf (date) {
  console.log((date.getTime() - toWeek(date).getTime()))
  return parseInt((date.getTime() - toWeek(date).getTime()) / msPerDay + EPS)
}

module.exports = {
  weeksBetween: weeksBetween,
  daysAfter: daysAfter,
  sameWeek: sameWeek,
  toWeek: toWeek,
  weekdayOf: weekdayOf,
  days: n => n * 1000 * 60 * 60 * 24,
  hours: n => n * 1000 * 60 * 60
}
