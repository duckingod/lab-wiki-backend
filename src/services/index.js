const {enable} = require('../config').service
module.exports = () => {
  for (let service of enable) {
    require('./' + service).start()
    console.log(service + ' service running...')
  }
}
