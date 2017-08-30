var models = require('../models');
var admins = require('./config').admins;

json = JSON.stringify
module.exports = function(model) {
  return {
    record: (req, res, next) => {
      model.findById(req.params.id).then(obj => {
        req.record = obj
        next()
      })
        .catch(error=>{
          res.status(503).send(json(error));
        });
    },
    owner: (req, res, next) => {
      email = req.user.email
      obj = req.record
      if (obj.owner && obj.owner.split(" ").indexOf(email)>=0
        || (admins && admins.indexOf(email)>=0) )
        next()
      else
        res.status(403).send("AuthenticationError: Not owner or admin")
    },
    index: (req, res) => {
      model.all().then(objs => {
        res.send(json(objs));
      })
        .catch(error=>{
          res.status(503).send(json(error));
        });
    },
    get: (req, res)  => {
      res.send(json(req.record))
    },
    new: (req, res) => {
      req.body.owner = req.user.email
      model.create(req.body).then(obj => {
        res.send('ok');
      })
        .catch(error=>{
          res.status(503).send(json(error));
        });
    },
    update: (req, res) => {
      req.record.updateAttributes(req.body)
        .then(id=>{
          res.send('ok')
        })
        .catch(error=>{
          res.status(503).send(json(error))
        });
    },
    delete: (req, res) => {
      model.destroy({where: {id: Number(req.record.id)}}).then(obj => {
        res.send('ok');
      })
        .catch(error=>{
          res.status(503).send(json(error));
        });
    },
    route:   '/'+model.name.toLowerCase(),
    idRoute: '/'+model.name.toLowerCase()+"/:id"
  }
};
