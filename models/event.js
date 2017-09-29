'use strict'

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
      type: DataTypes.STRING
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }

  })
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
