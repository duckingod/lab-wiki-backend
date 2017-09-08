let env = process.env.NODE_ENV || 'development'
let config = {
  development: {
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
    garbageGenesis: '2017-09-04',
    gApiConfig: {
      clientSecret: 'client_secret.json',
      scope: ['https://mail.google.com/']
    },
    mailService: {
      refreshTime: 3000
    },
    cfpService: {
      refreshTime: 3000
    },
    database: {
      dialect: 'sqlite',
      storage: './db.development.sqlite'
    }
  },
  production: {
    appUrl: 'http://nlg17.csie.ntu.edu.tw',
    gpuUsage: {
      url: 'http://localhost:13579'
    },
    database: {
      storage: './db.sqlite'
    },
    mailService: {
      refreshTime: 30000
    },
    cfpService: {
      refreshTime: 30000
    }
  }
}

if (env === 'production') env = ['production']

function completeConfig (env) {
  let _config = config.development
  function setDict (c, config, e) {
    for (let k in c) {
      if (!config[k]) {
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
