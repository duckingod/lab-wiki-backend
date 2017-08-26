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
        res.send('ok');
      });
    }
  },
  update: (model) => {
    return function(req, res) {
      model.findById(req.param.id).then(obj => {
        obj.updateAttributes(req.body)
          .on('success', id=>{
            res.send('ok');
          })
          .on('failure', error=>{
            res.status(401).send(JSON.stringify(error));
          });
      });
    }
  },
  route: (model) => { return '/'+model.name.toLowerCase(); },
  idRoute: (model) => { return '/'+model.name.toLowerCase()+"/:id"; }
};
