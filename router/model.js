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
      })
      .catch(error=>{
        res.status(503).send(JSON.stringify(error));
      });
    }
  },
  update: (model) => {
    return function(req, res) {
      model.findById(req.params.id).then(obj => {
        obj.updateAttributes(req.body)
          .then(id=>{
            res.send('ok');
          })
          .catch(error=>{
            res.status(503).send(JSON.stringify(error));
          });
      });
    }
  },
  delete: (model) => {
    return function(req, res) {
      model.destroy({where: {id: Number(req.params.id)}}).then(obj => {
        res.send('ok: '+String(req.params.id));
      })
      .catch(error=>{
        res.status(503).send(JSON.stringify(error));
      });
    }
  },
  route: (model) => { return '/'+model.name.toLowerCase(); },
  idRoute: (model) => { return '/'+model.name.toLowerCase()+"/:id"; }
};
