module.exports = {
  briefName: name => {
    // contains chinese / japanise
    if (name.match(/[\u3400-\u9FBF]/)) {
      return name.substr(name.length - 2)
    }
    if (name.match(/[A-Z]/)) {
      return name.substr(name.match(/[A-Z][^A-Z]*$/).index)
    }
    if (name.match(/ /)) {
      return name.substr(name.lastIndexOf(' ') + 1)
    }
    return name
  }
}
