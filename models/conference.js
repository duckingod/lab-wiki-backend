'use strict'

const xray = require('x-ray')()
const pendingUpdate = require('../services/cfp-service.js').push
const trimDate = x => {
  let date = new Date(x.trim())
  if (date == 'Invalid Date') return null // eslint-disable-line
  return date
}
const attr2field = {
  When: {
    field: 'when',
    trim: x => x.trim()
  },
  Where: {
    field: 'where',
    trim: x => x.trim()
  },
  'Submission Deadline': {
    field: 'deadlineDisplay',
    trim: x => x.trim()
  }
}

module.exports = function (sequelize, DataTypes) {
  var Conference = sequelize.define('Conference', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    when: DataTypes.STRING,
    where: DataTypes.STRING,
    url: DataTypes.STRING,
    cfpUrl: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    deadline: DataTypes.DATE,
    deadlineDisplay: DataTypes.STRING,
    updateThing: { // force update updateAt when updateAttributes
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  })
  Conference.prototype.updateDetail = function () {
    return new Promise((resolve, reject) => {
      xray(this.cfpUrl, '.gglu tr', [
        {
          attr: 'th',
          val: 'td'
        }
      ])((err, res) => {
        if (err) {
          reject(err)
          return
        }
        res.pop()
        let obj = {}
        for (let r of res) {
          let attr = attr2field[r.attr]
          if (attr) obj[attr.field] = attr.trim(r.val)
        }
        if ('deadlineDisplay' in obj) { obj.deadline = trimDate(obj.deadlineDisplay) }
        if ('when' in obj && obj.when.split('-').length === 2) {
          let [start, end] = obj.when.split('-')
          obj.start = trimDate(start)
          obj.end = trimDate(end)
        }
        xray(this.cfpUrl, 'a[target=_newtab]@href')((err, url) => {
          if (err) {
            reject(err)
            return
          }
          obj.url = url
          obj.updateThing = this.updateThing + 1
          this.updateAttributes(obj).then(resolve)
        })
      })
    })
  }

  Conference.afterCreate(function (conf, options) {
    return conf.updateDetail()
  })

  Conference.afterFind(function (confs, options, cb) {
    for (let conf of confs) { pendingUpdate(conf) }
  })

  return Conference
}
