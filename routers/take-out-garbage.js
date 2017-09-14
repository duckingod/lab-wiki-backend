const ContactList = require('../models').ContactList

module.exports = (req, res) =>
  ContactList.dutyWithDate('garbageId')
    .then(r => res.send(r))
    // .then(res.send)
    .catch(e => res.status(503).send(e))
    // .catch(res.status(503).send)
