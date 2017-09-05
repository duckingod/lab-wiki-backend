var env = process.env.NODE_ENV || 'development'
config = {
  "development": {
    "googleOauthClientId": "128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://nlg17.csie.ntu.edu.tw",
    "admins": "labwiki@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://nlg17.csie.ntu.edu.tw:5566/",
      "timeout": 30000
    }
  },
  "production": {
    "googleOauthClientId": "128291458390-1rjai5msiieuad8ofmeje5eonoplsmf5.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://nlg17.csie.ntu.edu.tw",
    "admins": "labwiki@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://nlg17.csie.ntu.edu.tw:5566/",
      "timeout": 30000
    }
  }
}
module.exports = config[env]
