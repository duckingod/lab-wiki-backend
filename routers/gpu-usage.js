const request = require('request')
const gpu = require('../config').gpuUsage

module.exports = (req, res) => {
  request.get(gpu.url, {timeout: gpu.timeout}, function(err, _res, body) {
    if(err) 
      res.status(503).send(err)
    else if(_res.statusCode !== 200 )
      res.status(503).send('ServiceError: gpu-usage-monitor unavaliable')
    else
      res.status(200).send(body)
  })
}
