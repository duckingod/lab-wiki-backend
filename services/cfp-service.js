const {refreshTime, reupdateTime} = require('../config').cfpService
let queue = []
module.exports = {
  start: () => {
    setInterval(() => {
      while (queue.length > 0) {
        let conf = queue.shift()
        if (Date.now() - conf.updatedAt.getTime() > reupdateTime) {
          conf.updateDetail()
          return
        }
      }
    }, refreshTime)
  },
  push: (conf) => {
    queue.push(conf)
  }
}
