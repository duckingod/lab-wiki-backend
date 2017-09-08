var fs = require('fs')
var utf8 = require('utf8')
var readline = require('readline')
var google = require('googleapis')
var GoogleAuth = require('google-auth-library')
var quotedPrintable = require('quoted-printable')
var config = require('../config').gApiConfig
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/lab-wiki.json
var SCOPES = config.scope
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  '/.credentials/'
var TOKEN_PATH = TOKEN_DIR + 'lab-wiki.json'
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 */
function authorize (credentials) {
  return new Promise((resolve, reject) => {
    var clientSecret = credentials.installed.client_secret
    var clientId = credentials.installed.client_id
    var redirectUrl = credentials.installed.redirect_uris[0]
    var auth = new GoogleAuth()
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        getNewToken(oauth2Client).then(auth => resolve(auth))
      } else {
        oauth2Client.credentials = JSON.parse(token)
        resolve(oauth2Client)
      }
    })
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 */
function getNewToken (oauth2Client) {
  return new Promise((resolve, reject) => {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url: ', authUrl)
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('Enter the code from that page here: ', function (code) {
      rl.close()
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err)
          return
        }
        oauth2Client.credentials = token
        storeToken(token)
        resolve(oauth2Client)
      })
    })
  })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken (token) {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to ' + TOKEN_PATH)
}

var sendMessage = function (auth, mailto, subject, body) {
  console.log(
    `Sending...
To: ${mailto}
Subject: ${subject}
${body}`
  )

  var gmail = google.gmail('v1')
  var emailLines = []
  // https://stackoverflow.com/questions/27695749/gmail-api-not-respecting-utf-encoding-in-subject
  subject = quotedPrintable.encode(utf8.encode(subject))
  emailLines.push('From: labwiki@nlg.csie.ntu.edu.tw')
  emailLines.push(`To: ${mailto}`)
  emailLines.push('Content-type: text/html;charset=utf-8')
  emailLines.push('MIME-Version: 1.0')
  emailLines.push(`Subject: =?utf-8?Q?${subject}?=`)
  emailLines.push('')
  emailLines.push(body)

  var email = emailLines.join('\r\n').trim()

  var base64EncodedEmail = new Buffer(email) // eslint-disable-line
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return new Promise((resolve, reject) => {
    gmail.users.messages.send(
      {
        auth: auth,
        userId: 'me',
        resource: {
          raw: base64EncodedEmail
        }
      },
      (err, response) => {
        if (err) {
          console.log('The API returned an error: ' + err)
          reject(err)
        } else {
          console.log('send mail success', response)
          resolve(response)
        }
      }
    )
  })
}

var getAuth = function () {
  return new Promise((resolve, reject) => {
    // Load client secrets from a local file.
    fs.readFile(config.clientSecret, function processClientSecrets (
      err,
      content
    ) {
      if (err) {
        reject(new Error('Error loading client secret file: ' + err))
      }
      // Authorize a client with the loaded credentials, then call the
      // Gmail API.
      authorize(JSON.parse(content)).then(auth => {
        resolve(auth)
      })
    })
  })
}

module.exports = {
  getAuth: getAuth,
  sendMessage: sendMessage
}
