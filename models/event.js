'use strict'

const {_with} = require('../utils').models

module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: DataTypes.DATE
    },
    meta: {
      type: DataTypes.STRING,
      get () {
        return JSON.parse(this.getDataValue('meta'))
      },
      set (meta) {
        return this.setDataValue('meta', JSON.stringify(meta))
      }
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })

  Event.prototype.with = _with

  Event.get = (name, date) =>
    Event.findAll(
      date != null
      ? {
        where: {
          name: { $eq: name },
          date: { $gte: date },
          enable: { $eq: true }
        },
        order: ['date']
      }
      : {
        where: {
          name: { $eq: name },
          enable: { $eq: true }
        }
      }
    )

  return Event
}
