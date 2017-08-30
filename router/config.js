env = "development";
config = {
  "development": {
    "googleOauthClientId": "904848968355-qqd08ni3a2pjgfe5hoc53tslnam7t12j.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://localhost:12345"
    },
  "production": {
    "googleOauthClientId": "904848968355-qqd08ni3a2pjgfe5hoc53tslnam7t12j.apps.googleusercontent.com",
    "validEmailDomain": "@nlg.csie.ntu.edu.tw",
    "loginExpirePeriod": 24*30, // a month
    "appUrl": "http://localhost:12345"
    }
}
module.exports = config[env];
