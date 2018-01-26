const xray = require('x-ray')()

module.exports = (req, res) => {
  xray(
    `http://www.wikicfp.com/cfp/servlet/tool.search?q=${req.query.q}&year=f`,
    '.contsec table table td',
    [
      {
        name: 'a',
        cfpUrl: 'a@href'
      }
    ]
  )((err, confs) => {
    if (err) {
      console.log(err)
      res.send([])
    } else {
      console.log(confs)
      res.send(confs)
    }
  })
}
