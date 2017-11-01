// content.date is [momentjs](https://momentjs.com/) object

let mailto = content => content.email.mailto.developer

let subject = content =>
  `Reminder: Lab Seminar (${content.presenters.join(' & ')})`

let body = content =>
`
This mail is just a reminder.
Please see the following information:

--
  Event: Lab seminar
  When: ${content.dates[0].format('mm/DD(d), YYYY')} (${content.seminar.startFrom}~)
  Where: ${content.seminar.place}
  Who: ${content.presenters.join(' & ')}
  Note: If the speaker is not available this week, please switch with other lab members as early as possible. Also, remember to mail the slides to ${content.email.sender.email} after the seminar.
--

Best Regards,
${content.email.sender.name}
`

module.exports = {
  subject: subject,
  mailto: mailto,
  body: body
}
