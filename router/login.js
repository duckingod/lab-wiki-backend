var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var crypto = require('crypto');
var GoogleAuth = require('google-auth-library');
var clientId = require('./config').googleOauthClientId;
var loginPeriod = require('./config').loginExpirePeriod;
var loginDomain = require('./config').validEmailDomain;

jwt_key = crypto.randomBytes(256);
function cookieJwt(credential) {
  return expressJwt({
    secret: jwt_key,
    credentialsRequired: credential,
    getToken: req => { return req.cookies.token; }
  });
}

var auth = new GoogleAuth;
var googleOauthClient = new auth.OAuth2(clientId, '', '');

module.exports = {
    checkUser: cookieJwt(false),
    forceUser: cookieJwt(true),
    simpleLoginWeb: function (user) {
      if (user!=null)
        user_msg = 'Welcome, '+user.name+' ('+user.email+')';
      else
        user_msg = 'Welcome, guest';
      return `
      <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="`+clientId+`">
      </head>
      <body>
        `+user_msg+`
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
        <a href='#' on-click='logout'>Logout?</a>
        <script>
        function onSignIn(user) {
          $.post( 'login', { id_token: user.getAuthResponse().id_token }, 
              (data, stat) => { alert('success'); } );
          }; 
        function logout(){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then( function() { alert('logout'); });
          };
        </script>
        <form action="/seminar" method="POST">
          <input type="text" name="title" placeholder="Title"/>
          <input type="text" name="presenter" placeholder="Presenter"/>
          <input type="text" name="date" placeholder="Date"/>
          <input type="submit"/>
        </form>
      </body>
      `
      },
    googleIdTokenLogin: function(req, res) {  
        var token = req.body.id_token;
        googleOauthClient.verifyIdToken(
            token,
            clientId,
            function(e, login) {
              var clientToken;
              if (login!=null) {
                var payload = login.getPayload();
                if (payload.email.endsWith(loginDomain)) {
                  // login successful
                  var userData = {
                    name: payload.name,
                    email: payload.email,
                    account: payload.email.split("@")[0]
                  };
                  var clientToken = jwt.sign(userData, jwt_key, {expiresIn: 60*60*loginPeriod});
                  res.cookie('token', clientToken).send("ok");
                  return;
                } else {
                  e = 'Wrong email server.';
                }
              }
              res.status(401).send(JSON.stringify(e));
            });
        },
    unloginError: function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          res.status(401).clearCookie('token').redirect('/');
           // .send('Please login<BR>'+JSON.stringify(err));
        }
      } 
}
