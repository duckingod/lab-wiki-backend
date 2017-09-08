const jwt = require('jsonwebtoken')
const {jwtKey} = require('../config')

module.exports = {
  loginCookie: (user, email) => {
    return (
      'token=' +
      jwt.sign({ user: user, email: email }, jwtKey, { expiresIn: 60 * 60 })
    )
  }
}
