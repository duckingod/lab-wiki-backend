const EMail = require('../models').EMail
const getAuth = require('./google-api').getAuth
const sendMessage = require('./google-api').sendMessage
const refreshTime = require('../config').mailService.refreshTime

setInterval(() => {
  getAuth().then(auth => {
    EMail.findAll({ where: { isSent: false, execTime: {$lte: new Date()} } }).then(emails => {
      for (let email of emails) {
        sendMessage(
          auth,
          email.mailto,
          email.subject,
          email.body
        ).then(resp => {
          if (resp.labelIds.indexOf('SENT') !== -1) { email.update({ isSent: true, sentDate: new Date() }).then() }
        })
      }
    })
  })
    .catch(error => console.log(error))
}, refreshTime)
