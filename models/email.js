"use strict"

module.exports = function(sequelize, DataTypes) {
  var EMail = sequelize.define("EMail", {
    mailto: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.STRING,
    execTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    sentDate: DataTypes.DATE,
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    key: {
      type: DataTypes.STRING,
      unique: true
    }
  })

  return EMail
}
