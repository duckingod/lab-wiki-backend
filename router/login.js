var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var crypto = require('crypto');
var GoogleAuth = require('google-auth-library');
var clientId = require('./config').googleOauthClientId;
var loginPeriod = require('./config').loginExpirePeriod;
var emailDomain = require('./config').validEmailDomain;

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
    checkLogin: cookieJwt(false),
    forceLogin: cookieJwt(true),
    emailDomain: (req, res, next) => {
        if (req.user.email.endsWith(emailDomain))
            next()
        else
            res.status(403).send(JSON.stringify({name: "forbidden"}))
    },
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
          <input type="text" name="topic" placeholder="Title"/>
          <input type="text" name="presenter" placeholder="Presenter"/>
          <input type="text" name="date" placeholder="Date"/>
          <input type="text" name="slides" placeholder="slides url"/>
          <input type="submit"/>
        </form>
        <form action="/seminar/2" method="POST">
          <input type="text" name="topic" placeholder="Title"/>
          <input type="text" name="presenter" placeholder="Presenter"/>
          <input type="text" name="date" placeholder="Date"/>
          <input type="text" name="slides" placeholder="slides url"/>
          <input type="submit" value='update 2'/>
        </form>
          <a href='#' onclick='go_delete(3)'> delete 3</a>
        <script>
          function go_delete(n){
            alert("go del");
            $.ajax({
                url: 'seminar/3',
                type: 'UPDATE',
                success: function(res) { }
              })
          }
        </script>

      </body>
      `
      },
    googleIdTokenLogin: function(req, res) {  
      var token = req.body.id_token;
      console.log("try to login");
      googleOauthClient.verifyIdToken(
          token,
          clientId,
          function(e, login) {
            var clientToken;
            if (login!=null) {
              var payload = login.getPayload();
              // login successful
              var userData = {
                name: payload.name,
                email: payload.email,
                account: payload.email.split("@")[0]
              };
              var clientToken = jwt.sign(userData, jwt_key, {expiresIn: 60*60*loginPeriod});
              res.cookie('token', clientToken).send("ok");
              console.log(payload.name+"@"+payload.email+" login ok");
              return;
            }
            res.status(401).send(JSON.stringify(e));
          });
      },
    unloginError: function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          console.log("UnauthorizedError happends");
          res.status(401).clearCookie('token').send(JSON.stringify(err));
           // .send('Please login<BR>'+JSON.stringify(err));
        }
      },
}
