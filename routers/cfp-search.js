const Conference = require("../models").Conference
const xray = require('x-ray')()

module.exports = (req, res) => {
  xray(
    `http://www.wikicfp.com/cfp/servlet/tool.search?q=${req.query.q}&year=n`,
    '.contsec table table td',
    [
      {
        name: 'a',
        url: 'a@href'
      }
    ]
  )((err, confs) => {
    console.log(confs)
    res.send(confs)
  })
}
