var models = require('./models');

data = require('./'+process.argv[2]);
model = models[process.argv[3]]

models.sequelize.sync().then(function() {
  data.forEach( d => {
    model.create(d)
  })
})
