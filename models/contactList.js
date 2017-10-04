'use strict'

let {genesis} = require('../config')
genesis = new Date(genesis)
const {daysAfter} = require('../utils').date
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

  ContactList.dutyList = async function (by) {
    let {Event} = require('../models')
    let duty = dutyProp(by)
    let [contacts, skips] = await Promise.all([
      this.findAll(duty.queryArgs),
      Event.get(duty.event)
    ])
    skips.sort((a, b) => Number(a.meta) < Number(b.meta))
    contacts.sort((a, b) => a[duty.id] - b[duty.id])
    let dutyGen = (function * () {
      let pos = 0
      let id = 0
      while (true) {
        if (pos < skips.length && id === Number(skips[pos].meta)) {
          yield { id: -1, contact: null }
          pos++
        } else {
          yield { id: id, contact: contacts[id % contacts.length] }
          id++
        }
      }
    }())
    return { next: () => dutyGen.next().value, nPerson: contacts.length }
  }

  ContactList.dutyWithDate = async (by, {nRound, nPerWeek, fromDate}) => {
    nRound = nRound || 2
    nPerWeek = nPerWeek || 1
    let list = await ContactList.dutyList(by)
    let schedule = []
    let date = genesis
    while (schedule.length < nRound * list.nPerson) {
      for (let j = 0; j < nPerWeek; j++) {
        let duty = list.next()
        if (duty.contact && date >= fromDate) {
          schedule.push({
            contact: duty.contact,
            date: date,
            id: duty.id
          })
        }
      }
      date = daysAfter(date, 7)
    }
    return schedule
  }

  return ContactList
}
