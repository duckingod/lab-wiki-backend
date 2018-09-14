// content.date is [momentjs](https://momentjs.com/) object
const {briefName} = require('../src/utils').email

let mailto = content => content.email.mailto.all

// Email title should be short. If it's too long, then Gmail will block the email.
// Gmail: block >= 78 character.
// Since chinese character is quite long in encoding of email, we limit it to 2 character.
let subject = content => `Lab Seminar (${content.presenters.map(p => briefName(p)).join(' & ')})`

let body = content => `
This mail is just a reminder.
Please see the following information:

--
  Event: Lab seminar
  When: ${content.dates[0].format('MM/DD(dd), YYYY')} (${content.seminar.startFrom}~)
  Where: ${content.seminar.place}
  Who: ${content.presenters.join(' & ')}
  Note: If the speaker is not available this week, please switch with other lab members as early as possible. Also, remember to upload the slides to ${content.email.sender.site} after the seminar.
--

Best Regards,
${content.email.sender.name}
`

module.exports = {
  subject: subject,
  mailto: mailto,
  body: body
}
