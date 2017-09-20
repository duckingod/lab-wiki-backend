'use strict'

const {updateRecords} = require('../utils').model

module.exports = function (sequelize, DataTypes) {
  var Seminar = sequelize.define('Seminar', {
    presenter: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    topic: {
      type: DataTypes.STRING
    },
    slides: {
      type: DataTypes.STRING
    },
    owner: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  })

  /*
  Seminar.associate = function (models) {
    Seminar.hasMany(models.Slide)
  }
  */

  Seminar.nextSeminars = () => {
    const {ContactList, System} = require('../models')
    const {preaddWeeks} = require('../config').seminarService
    const {daysAfter} = require('../utils').date
    return Promise.all([
      ContactList.dutyWithDate('seminarId', {nRound: 1, nSchedule: 2, group: 2}),
      System.load()
    ]).then(res => {
      let schedule = res[0]
      let weekday = res[1].seminarWeekday
      let seminars = []
      for (let presentation of schedule) {
        seminars.push(
          new Seminar({
            presenter: presentation.contact.name,
            owner: presentation.contact.account,
            date: daysAfter(presentation.date, preaddWeeks * 7 + weekday),
            topic: '.'
          })
        )
      }
      return seminars
    })
  }

  Seminar.addNextSeminars = () => {
    return Seminar.nextSeminars().then(seminars => {
      let addSeminars = []
      for (let seminar of seminars) {
        let args = {
          where: {
            date: { $eq: seminar.date },
            presenter: { $eq: seminar.presenter }
          }
        }
        addSeminars.push(
          Seminar.findAll(args)
            .then(res => res.length > 0 ? null : seminar))
      }
      return Promise.all(addSeminars)
    })
      .then(updateRecords)
  }

  return Seminar
}
