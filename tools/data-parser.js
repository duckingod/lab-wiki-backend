#!/usr/bin/env node

const path = require('path')
const models = require('../models')
const fs = require('fs')

let dataList = {}
let filePath = './' + process.argv[2]

if (path.extname(filePath) !== '') {
  let name = process.argv[3]
  dataList[name] = require(filePath)
} else {
  for (let name of Object.keys(models)) {
    if (name === 'sequelize' || name === 'Sequelize') continue
    let fileName = name.charAt(0).toLowerCase() + name.slice(1) + '.json'
    let fullPath = path.resolve(filePath, fileName)
    if (fs.existsSync(fullPath)) {
      dataList[name] = require(fullPath)
    }
  }
}

models.sequelize.sync().then(() => {
  Object.keys(dataList).forEach(name => {
    dataList[name].forEach(d => {
      models[name].create(d)
    })
  })
})
