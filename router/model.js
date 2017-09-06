const models = require('../models')
const admins = require('./config').admins
const emailDomain = require('./config').validEmailDomain

json = JSON.stringify

const permission = {
  admin:   user       => admins && user && admins.includes(user.email),
  owner:  (user, obj) => obj && obj.owner && user && obj.owner.split(" ").indexOf(email)>=0,
  role:     (user, obj) => {
    if (permission.admin(user))
        return 'admin'
    if (permission.owner(user, obj))
        return 'owner'
    if (user && user.email.endsWith(emailDomain))
        return 'user'
    return 'guest'
  },
  editable: (user, obj) => ['admin', 'owner'].includes(permission.role(user, obj))
}



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
    role: (user, obj ) => permission.role(user, obj),
    editable: (req, res, next) => {
      if ( permission.editable(req.user, req.record) )
        next()
      else {
        res.status(403).send("Forbidden: Not owner or admin")
      }
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
      if (req.body.owner==null)
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
