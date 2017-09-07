"use strict"

module.exports = function(sequelize, DataTypes) {
  var Conference = sequelize.define("Conference", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    when: DataTypes.STRING,
    where: DataTypes.STRING,
    url: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    deadline: DataTypes.DATE,
  })

  return Conference
}
