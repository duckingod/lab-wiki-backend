const request = require('request')
const monitor = require('../config').service.workstation

module.exports = (req, res) => {
  request.get(monitor.url, {timeout: monitor.timeout}, function (err, _res, body) {
    if (err) {
      res.status(503).send(err)
    } else if (_res.statusCode !== 200) {
      res.status(503).send('ServiceError: workstation-monitor unavaliable')
    } else {
      res.status(200).send(body)
    }
  })
}
