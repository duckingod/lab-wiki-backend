var models = require('../models');

module.exports = {
  get: (model) => {
    return function(req, res) {
      if (req.body.id) {
        model.findById(req.body.id).then(obj => {
          res.send(JSON.stringify(obj));
        });
      } else {
        model.all().then(objs => {
          res.send(JSON.stringify(objs));
        });
      }
    }
  },
  new: (model) => {
    return function(req, res) {
      model.create(req.body).then(obj => {
        req.redirect('/');
      });
    }
  }
};
