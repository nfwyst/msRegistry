const path = require('path')
const low = require('lowdb')
const { forEach } = require('ramda')
const FileSync = require('lowdb/adapters/FileSync')

class ServiceRegistry {
  constructor() {
    const pt = path.join(
      path.dirname(process.mainModule.filename),
      '..', 'server', 'database', 'db.json'
    )
    const adapter = new FileSync(pt)
    this.db = low(adapter)
    this.db.defaults({}).write()
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
