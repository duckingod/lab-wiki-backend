'use strict'

const genesis = new Date(require('../config'))

function weeksBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return parseInt((endDate.getTime() - startDate.getTime()) / millisecondsPerDay / 7)
}
function daysAfter (date, n) {
  let d = new Date(date)
  d.setDate(date.getDate() + n)
  return d
}

let weeklys = []

function weekly () {
  let now = new Date()
  startDate = daysAfter(toWeek(now), 7)
  let startOffset = startDate.getTime() - now.getTime()
  let week = 1000 * 60 * 60 * 24 * 7
  let w = async () => {
    for (let t of weeklys) {
      let wait = typeof t.wait === 'Function' ? await t.wait() : t.wait
      setTimeout(t.todo, wait)
    }
    setTimeout(w, week)
  }
  setTimeout(w, startOffset)
}

weekly()

module.exports = (waitTime, callback, options) => {
  if (options && options.instant === true) {
    callback()
  }
  weeklys.push(() => {
    wait: waitTime,
    todo: callback
  })
}
