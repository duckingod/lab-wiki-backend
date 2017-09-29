'use strict'

let {genesis} = require('../config')
genesis = new Date(genesis)
const {daysAfter, weeksBetween} = require('../utils').date
// const {listify} = require('../utils')

let {dutyProp} = require('../utils').schedule

module.exports = function (sequelize, DataTypes) {
  var ContactList = sequelize.define('ContactList', {
    seat: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    account: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: ['^[0-9-()#]+$', 'i'],
        notEmpty: true
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
              // isUrl: true
      }
    },
    seminarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 }
    },
    garbageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 }
    }
  })

  ContactList.dutyId = (from, nDutyPerWeek) => weeksBetween(genesis, from) * nDutyPerWeek
  ContactList.dutyList = function (by, options) {
    let {Event} = require('../models')
    let duty = dutyProp(by)
    return Promise.all([
      this.findAll(duty.queryArgs),
      Event.get(duty.event)
    ])
      .then(data => {
        let [contacts, skips] = data
        let duties = []
        let toId = options.toId
        if (options.nRound) {
          toId = options.fromId + contacts.length * options.nRound
        }
        for (let s of skips) {
          s.meta = JSON.parse(s.meta)
        }
        skips.sort((a, b) => a.meta < b.meta)
        let pos = 0
        contacts.sort((a, b) => a[duty.id] - b[duty.id])
        for (let id = 0; id < toId;) {
          if (pos < skips.length && id === skips[pos].meta) {
            duties.push({ id: -1, contact: null })
            pos++
          } else {
            duties.push({ id: id, contact: contacts[id % contacts.length] })
            id++
          }
        }
        return duties
      })
  }

  ContactList.dutyWithDate = (by, options = {}) => {
    let nRound = options.nRound || 2
    let nPerWeek = options.nPerWeek || 1
    let fromDate = options.fromDate
    return ContactList.dutyList(
      by, {
        fromId: ContactList.dutyId(fromDate, nPerWeek),
        nRound: nRound
      })
      .then(duties => {
        let schedule = []
        let date = genesis
        for (let i = 0; i < duties.length;) {
          for (let j = 0; j < nPerWeek; j++, i++) {
            if (i < duties.length && duties[i].contact && date >= fromDate) {
              schedule.push({
                contact: duties[i].contact,
                date: date,
                id: duties[i].id
              })
            }
          }
          date = daysAfter(date, 7)
        }
        return schedule
      })
  }

  return ContactList
}
