const path = require('path')
const fs = require('fs')
const low = require('lowdb')
const { forEach } = require('ramda')
const FileSync = require('lowdb/adapters/FileSync')

class ServiceRegistry {
  constructor() {
    const pt = path.join(
      path.dirname(process.mainModule.filename),
      '..', 'server', 'database', 'db.json'
    )
    this.mkfile(pt)
    const adapter = new FileSync(pt)
    this.db = low(adapter)
    this.db.defaults({}).write()
  }

  mkfile(filePath) {
    if (fs.existsSync(filePath)) return true
    this.mkdir(path.dirname(filePath))
    fs.closeSync(fs.openSync(filePath, 'w'))
  }

  mkdir(dirname) {
    if (fs.existsSync(dirname)) return true
    if (this.mkdir(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }

  to64(str) {
    return new Buffer.from(str).toString('base64')
  }

  get(key) {
    if(key) return this.db.get(this.to64(key)).value()
    return this.db.value()
  }

  add(key, value) {
    this.db.set(this.to64(key), value).write()
  }

  update(key, value) {
    this.db.get(this.to64(key)).assign(value).write()
  }

  remove(key) {
    if(!(key instanceof Array)) return this.db.unset(key).write()
    forEach(k => this.db.unset(k).write(), key)
  }
}

module.exports = ServiceRegistry
