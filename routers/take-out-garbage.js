'use strict'

const ContactList = require('../models').ContactList
const {err} = require('../utils').render
const {daysAfter} = require('../utils').date

module.exports = (req, res) =>
  ContactList.dutyWithDate('garbageId')
    .then(duties => {
      let out = []
      for (let duty of duties) {
        out.push({
          startDate: duty.date,
          endDate: daysAfter(duty.date, 6),
          contact: duty.contact
        })
      }
      res.send(out)
    })
    .catch(err(res, 503))
