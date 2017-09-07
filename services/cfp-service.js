const Conference = require('../models').Conference
const refreshTime = require('../config').cfpService.refreshTime
const xray = require('x-ray')()
const trimDate = x => {
  let date = new Date(x.trim())
  if (date == 'Invalid Date') return null
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

/*
xray(
  'http://www.wikicfp.com/cfp/servlet/tool.search?q=nlp&year=2018',
  '.contsec table table td',
  [
    {
      name: 'a',
      url: 'a@href'
    }
  ]
)((err, confs) => {
  console.log(confs)
  for (conf of confs) {
    Conference.create(conf).then((res, err) => {
      console.log(res, err)
    })
  }
})
*/

setInterval(() => {
  Conference.findAll({}).then(confs => {
    for (let conf of confs) {
      xray(conf.url, '.gglu tr', [
        {
          attr: 'th',
          val: 'td'
        }
      ])((err, res) => {
        res.pop()
        let obj = {}
        for (let r of res) {
          let attr = attr2field[r.attr]
          if (attr) obj[attr.field] = attr.trim(r.val)
        }
        if ('deadlineDisplay' in obj)
          obj.deadline = trimDate(obj.deadlineDisplay)
        if ('when' in obj && obj.when.split('-').length == 2) {
          let [start, end] = obj.when.split('-')
          obj.start = trimDate(start)
          obj.end = trimDate(end)
        }
        console.log(obj)
        conf.update(obj).then()
        console.log('========')
      })
    }
  })
}, refreshTime)
