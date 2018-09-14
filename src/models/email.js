'use strict'

const config = require('../config.js')

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

  // Send email, should be call by email service.
  // In development mode, the mail will only send to the developer.
  EMail.send = async (templateName, content, attachInfos) => {
    const templateConfig = require('../../templates/config')
    const template = require('../../templates/' + templateName)
    const {EMail} = require('../models')
    attachInfos.push('email')
    for (let k of attachInfos) content[k] = templateConfig[k]
    for (let k in template) template[k] = template[k](content)
    template.body = template.body.replace(/\n/g, '<br>\n')
    if (config.env.includes('development')) {
      template.mailto = templateConfig.email.mailto.developer
    }
    await EMail.create(template)
  }

  return EMail
}
