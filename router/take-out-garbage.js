const ContactList = require('../models').ContactList
const garbageGenesis = require('./config').garbageGenesis

module.exports = (req, res) => {
  ContactList.all().then(contacts => {
    let startDate = new Date(garbageGenesis)
    let schedule = []
    for (let round = 0; round < 2; round++) {
      for (let contact of contacts) {
        let endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        schedule.push({
          startDate: new Date(startDate),
          endDate: endDate,
          contact: contact,
        })
        startDate.setDate(startDate.getDate() + 7)
      }
    }
    res.status(200).send(schedule)
  }).catch(error => {
    res.status(503).send(error)
  });
}
