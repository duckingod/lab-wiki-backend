#!/usr/bin/node --harmony
'use strict'

function prettyError (err) {
  let out = {}
  out.name = err.name
  out.message = err.message
  if (err.errors != null) {
    out.errors = []
    for (let e of err.errors) {
      let _out = {}
      for (let k in e) {
        if (!k.startsWith('__') && typeof e[k] !== 'object') {
          _out[k] = e[k]
        }
      }
      out.errors.push(_out)
    }
  }
  console.log(err)
  return out
}

function Schedule ({contact, date, id}) {
  this.contact = contact
  this.date = date
  this.id = id
}
Schedule.prototype.copy = function () {
  return new Schedule({
    contact: this.contact,
    date: this.date,
    id: this.id
  })
}

module.exports = {
  error: {
    pretty: prettyError,
    send: (res, status) => err =>
      res.status(status).send(prettyError(err)),
    handle: (errName, status, cb = r => r) =>
      (err, req, res, next) =>
        err.name === errName
          ? cb(res).status(status).send(prettyError(err))
          : next(err)
  },
  date: require('./date'),
  model: require('./model'),
  email: require('./email'),
  const: {
    event: {
      seminar: {
        swap: 'seminar swap',
        skip: 'seminar postpone'
      },
      garbage: {
        skip: 'garbage postpone'
      }
    }
  },
  schedule: {
    dutyProp: by => {
      let {skip} = require('../utils').const.event[by]
      let args = { where: {}, order: [by + 'Id'] }
      args.where[by + 'Id'] = {$gte: 1}
      return {
        id: by + 'Id',
        offset: by + 'IdOffset',
        event: skip,
        queryArgs: args
      }
    },
    Schedule: Schedule
  },
  listify: (p1, p2) => {
    let constructor = cb => ary => {
      let out = []
      let push = a => {
        let tmp = cb(a)
        if (tmp !== undefined) {
          out.push(tmp)
        }
      }
      if (typeof ary === 'number') {
        for (let i = 0; i < ary; i++) {
          push(i)
        }
      } else {
        for (let a in ary) {
          push(ary[a])
        }
      }
      return out
    }

    if (p2 === undefined) {
      return constructor(p1)
    } else {
      return constructor(p2)(p1)
    }
  },
  promise: obj => new Promise(resolve => resolve(obj)),
  debug: {
    j: obj => JSON.stringify(obj, null, 3)
  }
}
