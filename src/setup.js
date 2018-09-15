'use strict'

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const exec = Promise.promisify(require('child_process').exec)
const md5 = file => exec('src/tools/md5 ' + file)
const srcPath = path.join('src', 'custom')
const toSrc = file => path.join(srcPath, file)

const allFiles = (base, suffix = []) => {
  const sp = name => path.join(...suffix, name)
  const bp = name => path.join(...base, ...suffix, name)
  let dirs = fs.readdirSync(bp(''))
  let files = []
  for (let d of dirs) {
    if (fs.lstatSync(bp(d)).isDirectory()) {
      files.push(allFiles(base, suffix.concat(d)))
    } else {
      files.push(sp(d))
    }
  }
  return [].concat(...files)
}
const backupFile = async f => {
  if (fs.existsSync(f)) {
    let d = path.dirname(f)
    let n = path.basename(f)
    let newF = path.join(d, `.${n}-${await md5(f)}`.trim())
    return fs.renameAsync(f, newF)
  }
}
const main = async args => {
  console.log('Setup template ...')
  let files = allFiles([srcPath])
  let alreadyExists = !files.map(f => !fs.existsSync(f)).every(b => b)
  if (alreadyExists) {
    if (!args.backup && !args.overwrite) {
      console.log('Some file already exists, need --backup or --overwrite')
      console.log('Setup process will terminate')
      return
    }
  }
  if (args.backup) {
    console.log('backuping ...')
    await Promise.all(files.map(f => backupFile(f)))
    console.log('done')
  }
  console.log('copying')
  await Promise.all(files.map(f => fs.copyFileAsync(toSrc(f), f)))
  console.log('done')
}
module.exports = main
