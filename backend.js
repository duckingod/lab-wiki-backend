var express = require('express');  
var app = express();  
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('./router')(app);

models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   */
  //models.Seminar.create({title: 'Hi!', presenter:'DaiShen', date:new Date()});
  console.log('Express server listening on port 3000');
  app.listen(3000);
});

