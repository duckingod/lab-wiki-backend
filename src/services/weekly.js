'use strict'

const {toWeek, daysAfter, days} = require('../utils').date

let weeklys = []

function weekly () {
  let now = new Date()
  let startDate = daysAfter(toWeek(now), 7)
  let startOffset = startDate.getTime() - now.getTime()
  let week = days(7)
  let w = async () => {
    for (let t of weeklys) {
      let wait = (typeof t.wait === 'function') ? await t.wait() : t.wait
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
  weeklys.push({
    wait: waitTime,
    todo: callback
  })
}
