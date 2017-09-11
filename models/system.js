'use strict'

module.exports = function (sequelize, DataTypes) {
  let offset = {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }

  var System = sequelize.define('System', {
    seminarIdOffset: offset,
    garbageIdOffset: offset
  })

  System.load = () => new Promise((resolve, reject) =>
    System.all().then(vars =>
      (vars.length ? System.findById(1) : System.create()).then(resolve).catch(reject))
  )

  return System
}
