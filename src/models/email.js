'use strict'

module.exports = function (sequelize, DataTypes) {
  var EMail = sequelize.define('EMail', {
    mailto: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    subject: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    body: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    execTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    sentDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  })

  EMail.send = async (templateName, content, attachInfos) => {
    const templateConfig = require('../../templates/config')
    const template = require('../../templates/' + templateName)
    const {EMail} = require('../models')
    attachInfos.push('email')
    for (let k of attachInfos) content[k] = templateConfig[k]
    for (let k in template) template[k] = template[k](content)
    template.body = template.body.replace(/\n/g, '<br>\n')
    await EMail.create(template)
  }

  return EMail
}
