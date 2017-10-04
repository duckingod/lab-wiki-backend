'use strict'

module.exports = (req, res, next) => {
  let send = res.send
  res.send = function (obj) {
    if (typeof arguments[0] === 'object') {
      arguments[0] = JSON.stringify(arguments[0], null, 3)
    }
    console.log(arguments[0])
    send.apply(res, arguments)
  }
  next()
}
