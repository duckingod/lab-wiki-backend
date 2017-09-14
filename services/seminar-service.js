'use strict'

const weekly = require('./weekly')
const {genesis} = require('../config')
const {Seminar, ContactList} = require('../models')

const main = () => {
  ContactList.dutyWithDate('seminarId')
    .then(schedule => {
      console.log(schedule)
      let presenters = schedule.slice(0, 2)
      for (let p of presenters) {
        console.log(p)
        Seminar.create(
          {
            presenter: p.contact.name,
            date: p.startDate
          }
        ).then(console.log)
      }
    })
}

module.exports = weekly(genesis, main)

require('../models').sequelize.sync().then(main)
