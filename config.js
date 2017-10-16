let crypto = require('crypto')
let env = process.env.NODE_ENV || 'development'
let config = {
  development: {
    webAppUrl: 'http://localhost:12345',
    prettyJson: true,
    port: 3000,
    googleOauthClientId:
      '128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com',
    validEmailDomain: '@nlg.csie.ntu.edu.tw',
    loginExpirePeriod: 24 * 30, // a month
    admins: ['labwiki@nlg.csie.ntu.edu.tw'],
    gpuUsage: {
      url: 'http://nlg17.csie.ntu.edu.tw/monitor',
      timeout: 30000
    },
    genesis: '2017/09/04',
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
    webAppUrl: null,
    prettyJson: false,
    port: 12345,
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
    jwtKey: 'vicky_godlike',
    webAppUrl: null,
    prettyJson: false,
    port: 5566
  }
}

if (env === 'production') env = ['production']
if (env === 'test') env = ['test']

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
