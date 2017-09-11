'use strict'

let {garbageGenesis} = require('../config')
let {System} = require('../models')
function weeksBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (endDate.getTime() - startDate.getTime()) / millisecondsPerDay / 7;
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

  ContactList.dutyList = function(by, offset=0) {
    return new Promise((resolve, reject) => {
      let args = {where: {}}
      args['where'][by] = {$gte: 1}
      console.log("Hi")
      this.findAll(args).then(contacts => {
        let ord = c => (c[by] + offset - 1) % contacts.length
        contacts.sort((a, b) => ord(a)-ord(b))
        resolve(contacts)
      })
        .catch(err => reject)
    })
  }

  ContactList.garbageDuty = function() {
      console.log("Hi")
    return new Promise((resolve, reject) => {
      this.dutyList('garbageId', weeksBetween(new Date(), garbageGenesis)).then(
        res => {
          console.log(res)
          return res
        }
      
      ).then(resolve)
    })
  }

  ContactList.seminarOrder = function () {
    return new Promise((resolve, reject) => {
      System.load().then(sys => 
        ContactList.dutyList('seminarId', sys.seminarIdOffset).then(resolve)
      )
    })
  }

  return ContactList
}
