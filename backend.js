var express = require('express');  
var app = express();  
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('./src/router')(app);

console.log("server listen on port 3000");
app.listen(3000);
