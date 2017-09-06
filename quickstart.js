var fs = require('fs');
var utf8 = require('utf8');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var quotedPrintable = require('quoted-printable');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://mail.google.com/'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  authorize(JSON.parse(content), sendMessage);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

function sendMessage(auth) {
  //https://stackoverflow.com/questions/27695749/gmail-api-not-respecting-utf-encoding-in-subject
  var gmail = google.gmail('v1');
  var email_lines = [];
  name = '大神'
  subject = `Keep our lab clean (${name})`
  subject = quotedPrintable.encode(utf8.encode(subject))
  email_lines.push("From: labwiki@nlg.csie.ntu.edu.tw");
  email_lines.push("To: thyang@nlg.csie.ntu.edu.tw");
  email_lines.push('Content-type: text/html;charset=utf-8');
  email_lines.push('MIME-Version: 1.0');
  email_lines.push(`Subject: =?utf-8?Q?${subject}?=`);
  email_lines.push("");
  email_lines.push(`Dear lab members,<br>
  <br>
  ${name} will take responsibility for keeping our lab clean during 9/20(Sun)~9/26(Sat), 2017.<br>
  We appreciate for his/her efforts.<br>
  <br>
  Best Regards,<br>
  Kanna<br>
  <img src="http://i.imgur.com/1BdSXSDg.png" style="width: 150px">
  `);

  var email = email_lines.join("\r\n").trim();

  var base64EncodedEmail = new Buffer(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  console.log(base64EncodedEmail);

  function sendDone(err, response) {
      if (err) {
          console.log('The API returned an error: ' + err);
          return;
      }
      console.log('send mail success', response);
  }

  gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: base64EncodedEmail
      }
  }, sendDone);
}