let procEnv = process.env.NODE_ENV
let env = ['development']
if (procEnv === 'production') env = ['production']
if (procEnv === 'test') env = ['test']
if (env.length === 0) env = ['development']

let config = require('../config')

function completeConfig (env) {
  let resultConfig = config.development
  function setDict (c, resultConfig, e) {
    for (let k in c) {
      if (resultConfig[k] === undefined) {
        throw new Error('The ' + e + ' config sets more than original config: ' + k)
      } else if (typeof c[k] === 'object' && !Array.isArray(c[k]) && c[k] !== null) {
        setDict(c[k], resultConfig[k], e)
      } else {
        resultConfig[k] = c[k]
      }
    }
  }
  for (let e of env) setDict(config[e], resultConfig, e)
  resultConfig.env = env
  return resultConfig
}

module.exports = completeConfig(env)
