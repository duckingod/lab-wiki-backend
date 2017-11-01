let env = process.env.NODE_ENV || 'development'
if (env === 'production') env = ['production']
if (env === 'test') env = ['test']

let config = require('../config')

function completeConfig (env) {
  let _config = config.development
  function setDict (c, config, e) {
    for (let k in c) {
      if (config[k] === undefined) {
        throw new Error('The ' + e + ' config sets more than original config: ' + k)
      } else if (typeof c[k] === 'object' && !Array.isArray(c[k])) {
        setDict(c[k], config[k], e)
      } else { config[k] = c[k] }
    }
  }
  for (let e of env) setDict(config[e], _config, e)
  return _config
}

module.exports = completeConfig(env)
