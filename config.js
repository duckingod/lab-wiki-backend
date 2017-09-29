let crypto = require('crypto')
let env = process.env.NODE_ENV || 'development'
let config = {
  development: {
    staticWebApp: false,
    port: 3000,
    googleOauthClientId:
      '128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com',
    validEmailDomain: '@nlg.csie.ntu.edu.tw',
    loginExpirePeriod: 24 * 30, // a month
    appUrl: 'http://localhost:12345',
    admins: ['labwiki@nlg.csie.ntu.edu.tw'],
    gpuUsage: {
      url: 'http://nlg17.csie.ntu.edu.tw:5566/',
      timeout: 30000
    },
    genesis: '2017-09-04',
    gApiConfig: {
      clientSecret: 'client_secret.json',
      scope: ['https://mail.google.com/']
    },
    mailService: {
      refreshTime: 30000
    },
    cfpService: {
      refreshTime: 3000,
      reupdateTime: 10000
    },
    seminarSchedule: {
      weeks: 4,
      perWeek: 2
    },
    database: {
      dialect: 'sqlite',
      storage: './db.development.sqlite'
    },
    jwtKey: 'vicky_is_sooooo_god'
  },
  production: {
    staticWebApp: true,
    port: 12345,
    appUrl: 'http://nlg17.csie.ntu.edu.tw',
    gpuUsage: {
      url: 'http://localhost:13579'
    },
    seminarSchedule: {
      weeks: 24
    },
    database: {
      storage: './db.sqlite'
    },
    mailService: {
      refreshTime: 3000000
    },
    cfpService: {
      refreshTime: 10000,
      reupdateTime: 1000 * 60 * 60 * 24 * 10 // 10 days
    },
    jwtKey: crypto.randomBytes(256).toString('hex')
  },
  test: {
    jwtKey: 'vicky_godlike'
  }
}

if (env === 'production') env = ['production']
if (env === 'test') env = ['test']

/*
// Compact with sequelize cli
function writeDBConfig () {
  const fs = require('fs')
  let dbConfig = {}
  for (let env of ['development', 'production', 'test']) {
    dbConfig[env] = completeConfig(env)['database']
  }
  dbConfig = JSON.stringify(dbConfig, null, 2)
  fs.writeFile('config/config.json', dbConfig, 'utf8')
}
*/

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

// writeDBConfig()
module.exports = completeConfig(env)
