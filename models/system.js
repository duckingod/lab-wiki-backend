'use strict'

module.exports = function (sequelize, DataTypes) {

  var System = sequelize.define('System', {
    seminarIdOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    garbageIdOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    seminarWeekday: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 6
      }
    }
  })

  System.load = () => new Promise((resolve, reject) =>
    System.all().then(vars =>
      (vars.length ? System.findById(1) : System.create()).then(resolve).catch(reject))
  )

  System.change = callback => {
    return new Promise((resolve, reject) => {
      System.load().then(config => {
        callback(config)
        config.save().then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  return System
}
