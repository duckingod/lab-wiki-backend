var env = process.env.NODE_ENV || 'development'
config = {
  "development": {
    "googleOauthClientId": "904848968355-qqd08ni3a2pjgfe5hoc53tslnam7t12j.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://localhost:12345",
    "admins": "cwtsai@nlg.csie.ntu.edu.tw pchuang@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://localhost:28888",
      "timeout": 3000
    }
  },
  "production": {
    "googleOauthClientId": "904848968355-qqd08ni3a2pjgfe5hoc53tslnam7t12j.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://localhost:12345",
    "admins": "cwtsai@nlg.csie.ntu.edu.tw pchuang@nlg.csie.ntu.edu.tw",
    "gpuUsage": {
      "url": "http://localhost:28888",
      "timeout": 3000
    }
  }
}
module.exports = config[env]
