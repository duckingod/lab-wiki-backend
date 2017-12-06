const {EMail} = require('../models')
const {getAuth, sendMessage} = require('./google-api')
const {refreshTime} = require('../config').service.email

module.exports = {
  start: () =>
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
}
