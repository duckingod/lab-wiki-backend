let crypto = require('crypto')
module.exports = {
  development: {
    port: 3000,
    webAppUrl: 'http://localhost:12345',
    genesis: '2017/09/04',
    jwtKey: 'vicky_is_sooooo_god',
    permission: {
      emailDomain: '@nlg.csie.ntu.edu.tw',
      expirePeriod: 24 * 30, // a month
      admins: ['labwiki@nlg.csie.ntu.edu.tw']
    },
    google: {
      oauthClientId:
        '128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com',
      clientSecret: 'client_secret.json',
      scope: ['https://mail.google.com/']
    },
    database: {
      dialect: 'sqlite',
      storage: './db.development.sqlite'
    },
    service: {
      email: {
        refreshTime: 30000
      },
      conference: {
        refreshTime: 3000,
        reupdateTime: 10000
      },
      seminar: {
        schedule: {
          weeks: 2,
          perWeek: 2
        }
      },
      workstation: {
        url: 'http://nlg17.csie.ntu.edu.tw/monitor',
        timeout: 30000
      }
    }
  },
  production: {
    port: 12345,
    webAppUrl: null,
    jwtKey: crypto.randomBytes(256).toString('hex') + 'vicky_godlike',
    database: {
      storage: './db.sqlite'
    },
    service: {
      email: {
        refreshTime: 3000000
      },
      conference: {
        refreshTime: 10000,
        reupdateTime: 1000 * 60 * 60 * 24 * 10 // 10 days
      },
      seminar: {
        schedule: {
          weeks: 4
        }
      },
      workstation: {
        timeout: 5000
      }
    }
  },
  test: {
    port: 5566,
    webAppUrl: null,
    jwtKey: 'vicky_godlike'
  }
}
