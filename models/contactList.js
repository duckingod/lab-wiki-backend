'use strict'

let {genesis} = require('../config')
function weeksBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return (endDate.getTime() - startDate.getTime()) / millisecondsPerDay / 7
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
    args['where'][by] = {$gte: 1}
    return Promise.all([
      new Promise((resolve, reject) => {
        this.findAll(args).then(resolve).catch(reject)
      }),
      new Promise((resolve, reject) => {
        System.load().then(r => resolve(r[by + 'Offset'])).catch(reject)
      })
    ])
    .then(data => {
      let contacts = data[0]
      let offset = data[1] + weeksBetween(new Date(genesis), new Date())
      let ord = c => (c[by] + offset - 1) % contacts.length
      contacts.sort((a, b) => ord(a) - ord(b))
      return contacts
    })
  }

  return ContactList
}
