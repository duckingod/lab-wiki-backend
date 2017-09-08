const Conference = require('../models').Conference
const refreshTime = require('../config').cfpService.refreshTime
const xray = require('x-ray')()
const trimDate = x => {
  let date = new Date(x.trim())
  if (date == 'Invalid Date') return null // eslint-disable-line
  return date
}
const attr2field = {
  When: {
    field: 'when',
    trim: x => x.trim()
  },
  Where: {
    field: 'where',
    trim: x => x.trim()
  },
  'Submission Deadline': {
    field: 'deadlineDisplay',
    trim: x => x.trim()
  }
}

setInterval(() => {
  Conference.findAll({}).then(confs => {
    for (let conf of confs) {
      xray(conf.cfpUrl, '.gglu tr', [
        {
          attr: 'th',
          val: 'td'
        }
      ])((err, res) => {
        if (err) {
          console.log(err)
          return
        }
        res.pop()
        let obj = {}
        for (let r of res) {
          let attr = attr2field[r.attr]
          if (attr) obj[attr.field] = attr.trim(r.val)
        }
        if ('deadlineDisplay' in obj) { obj.deadline = trimDate(obj.deadlineDisplay) }
        if ('when' in obj && obj.when.split('-').length === 2) {
          let [start, end] = obj.when.split('-')
          obj.start = trimDate(start)
          obj.end = trimDate(end)
        }
        conf.update(obj).then()
      })
      xray(conf.cfpUrl, 'a[target=_newtab]@href')((err, url) => {
        if (err) {
          console.log(err)
          return
        }
        conf.update({url: url}).then()
      })
    }
  })
}, refreshTime)
