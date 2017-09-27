'use strict'

let {genesis} = require('../config')
genesis = new Date(genesis)
const {daysAfter, weeksBetween} = require('../utils').date


let dutyProp = by => {
  id: by + "Id",
  offset: by + "IdOffset",
  event: name => by + name
}

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

  ContactList.dutyList = function (by, offset = 0) {
    let System = require('../models').System
    let args = {where: {}}
    let duty = dutyProp(by)
    args['where'][duty.id] = {$gte: 1}
    return Promise.all([
      this.findAll(args),
      Event.withName(duty.event)
    ])
      .then(data => {
        let [contacts, events] = data
        let weeks = weeksBetween(genesis, new Date())
        let weekSince = daysAfter(genesis, weeks * 7)
        let n = contacts.length
        let ord = c => ((c[by] + offset - 1) % n + n) % n
        contacts.sort((a, b) => ord(a) - ord(b))
        return {contacts: contacts, from: weekSince}
      })
  }

  ContactList.dutyWithDate = (by, options = {}) =>
    ContactList.dutyList(by)
      .then(res => {
        let {contacts, from} = res
        let schedule = []
        let nRound = options.nRound || 2
        let group = options.group || 1
        let nSchedule = options.nSchedule || contacts.length
        for (let i = 0; i < nRound * nSchedule; i++) {
          schedule.push({
            date: new Date(from),
            contact: contacts[i % nSchedule]
          })
          if ((i + 1) % group === 0) {
            from = daysAfter(from, 7)
          }
        }
        return schedule
      })

  return ContactList
}
