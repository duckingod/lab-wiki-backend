// content.date is [momentjs](https://momentjs.com/) object

let mailto = content => content.email.mailto.developer

let subject = content => `Lab Seminar (${content.presenters.join(' & ')})`

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
