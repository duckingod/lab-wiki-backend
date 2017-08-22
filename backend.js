var express = require('express');  
var app = express();  
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var cookieParser = require('cookie-parser')

jwt_key = crypto.randomBytes(256);

app.use(cookieParser());
checkJwt = expressJwt({
    secret: jwt_key,
    getToken: req => {
        return req.cookies.token;
    }
});

app.get('/login', function(req, res) {  
    var token = jwt.sign({ data: 'none'}, jwt_key, {expiresIn: 60*60});
    res.cookie('token', token).send("login ok")
});  

app.get('/', checkJwt, function(req, res) {  
    res.send(JSON.stringify(req.user));
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('You should <a href="login">login</a> first');
    }
});

console.log("server listen on port 3000");
app.listen(3000);
