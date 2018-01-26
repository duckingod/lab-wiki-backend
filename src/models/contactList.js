'use strict'

const config = require('../config')
const utils = require('../utils')
let {genesis} = require('../config')
genesis = new Date(genesis)
const {daysAfter, weeksBetween, toWeek} = utils.date
// const {listify} = require('../utils')

let {dutyProp, Schedule} = utils.schedule
const {modifyRecords, updateRecords} = utils.model
const validEmailDomain = config.permission.emailDomain

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

  Object.defineProperty(ContactList.prototype, 'accountEmail', {
    get: function () {
      return this.getDataValue('account') + validEmailDomain
    },
    set: function (emailAccount) {
      this.setDataValue('account', emailAccount.substring(0, emailAccount.indexOf('@')))
      return this.getDataVaule('account')
    }
  })

  ContactList.dutyContacts = async function (by) {
    let duty = dutyProp(by)
    let contacts = await this.findAll(duty.queryArgs)
    contacts.sort((a, b) => a[duty.id] - b[duty.id])
    return contacts
  }
  ContactList.dutyList = async function (by, toList) {
    let {Event} = require('../models')
    let duty = dutyProp(by)
    let [contacts, skips] = await Promise.all([
      ContactList.dutyContacts(by),
      Event.get(duty.event)
    ])
    skips.sort((a, b) => Number(a.meta) < Number(b.meta))
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

  ContactList.dutyWithDate = async (by, {nRound, nPerWeek, fromDate, toDate, all}) => {
    nRound = nRound || 2
    nPerWeek = nPerWeek || 1
    fromDate = fromDate ? toWeek(fromDate) : fromDate
    let list = await ContactList.dutyList(by)
    let schedule = []
    let date = genesis
    let cnt = 0
    const loopContinue = () => {
      const beforeDate = !toDate || date < toDate
      const enough = !nRound || cnt < nRound * list.nPerson
      return beforeDate && enough
    }
    while (loopContinue()) {
      for (let j = 0; j < nPerWeek; j++) {
        let duty = list.next()
        if (duty.contact && (all || (!fromDate || date >= fromDate))) {
          schedule.push(new Schedule({
            contact: duty.contact,
            date: date,
            id: duty.id
          }))
          if (fromDate && date >= fromDate) {
            cnt++
          }
        }
      }
      date = daysAfter(date, 7)
    }
    return schedule
  }

  ContactList.setScheduleId = async (by, idList, date, perWeek) => {
    let idxThisWeek = weeksBetween(genesis, date) * perWeek % idList.length
    let duty = dutyProp(by)
    return ContactList.all()
      .then(modifyRecords(contact => {
        let idx = idList.indexOf(contact.id)
        contact[duty.id] = idx >= 0
          ? (idx + idxThisWeek) % idList.length + 1
          : 0
      }))
      .then(updateRecords)
  }

  return ContactList
}
