'use strict'

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
function modifyRecordsAsync (operation) {
  return (records) => {
    let promises = []
    for (let r of records) {
      if (!r) { continue }
      promises.push(new Promise((resolve, reject) => {
        operation(r).then(() => resolve(r)).catch(reject)
      }))
    }
    return Promise.all(promises)
  }
}
function updateRecords (records) {
  let promises = []
  for (let r of records) {
    if (!r) { continue }
    promises.push(r.save().then(a => a.reload()))
  }
  return Promise.all(promises)
}

module.exports = {
  modifyRecords: modifyRecords,
  modifyRecordsAsync: modifyRecordsAsync,
  updateRecords: updateRecords,
  _with: function (values) {
    for (let k in values) {
      this[k] = values[k]
    }
    return this
  }
}
