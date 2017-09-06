var env = process.env.NODE_ENV || 'development'
config = {
  "development": {
    "googleOauthClientId": "128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://localhost:12345",
    "admins": "labwiki@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://nlg17.csie.ntu.edu.tw:5566/",
      "timeout": 30000
    },
    'garbageGenesis': '2017-09-04',
  },
  "production": {
    "googleOauthClientId": "128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://nlg17.csie.ntu.edu.tw",
    "admins": "labwiki@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://localhost:13579",
      "timeout": 30000
    },
    'garbageGenesis': '2017-09-04',    
  }
}
module.exports = config[env]
