'use strict'

module.exports = function (sequelize, DataTypes) {
  var System = sequelize.define('System', {
    seminarIdOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
     },
  })

  let loadOrCreate = objs => (objs.length ? System.findById(1) : System.create()).then
  System.load = new Promise((resolve, reject) =>
    System.findAll({}).then(loadOrCreate).then(t => t(resolve))
  )

  return System
}
