'use strict'

const {updateRecords} = require('../utils').model
const {listify} = require('../utils')

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
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    placeholder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  })

  /*
  Seminar.associate = function (models) {
    Seminar.hasMany(models.Slide)
  }
  */
  Seminar.beforeUpdate(function (seminar, options) {
    seminar.placeholder = false
  })

  Seminar.nextSeminars = fromDate => {
    const {ContactList} = require('../models')
    const {weeks} = require('../config').seminarSchedule
    return ContactList.dutyWithDate(
      'seminar',
      {
        nRound: weeks,
        nPerWeek: 2,
        fromDate: fromDate
      })
      .then(listify(presentation =>
        new Seminar({
          presenter: presentation.contact.name,
          owner: presentation.contact.account,
          date: presentation.date,
          scheduleId: presentation.id,
          topic: '.'
        })
      ))
  }

  Seminar.applySwap = seminars => {}

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
