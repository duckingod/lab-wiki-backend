const EMail = require('../models').EMail
const getAuth = require('./google-api').getAuth
const sendMessage = require('./google-api').sendMessage
const refreshTime = require('../config').mailService.refreshTime

let name = '大神'
let subject = `Keep our lab clean (${name})`
let body = `Dear lab members,<br>
<br>
${name} will take responsibility for keeping our lab clean during 9/20(Sun)~9/26(Sat), 2017.<br>
We appreciate for his/her efforts.<br>
<br>
Best Regards,<br>
Kanna<br>
<img src="http://i.imgur.com/1BdSXSDg.png" style="width: 150px">
`

let key = Math.random()

let mail = {
  subject: subject,
  body: body,
  mailto: 'thyang@nlg.csie.ntu.edu.tw',
  isSent: false,
  key: key
}

EMail.create(mail).then()

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
}, refreshTime)
