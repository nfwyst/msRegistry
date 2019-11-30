const { satisfies } = require('semver')
const { filter, pipe, values, forEachObjIndexed } = require('ramda')
const serviceRegistryModel = require('^server/model/ServiceRegistry')

class ServiceRegistry {
  constructor(log, timeout) {
    this.log = log
    this.services = new serviceRegistryModel()
    this.timeout = timeout
  }

  register(name, version, ip, port) {
    this.expire()
    const key = `${name}${version}${ip}${port}`
    const timestamp = Math.floor(new Date() / 1000)
    if(!this.services.get(key)) {
      this.services.add(key, { timestamp, name, version, ip, port })
      this.log.debug(`添加微服务: ${name}, 版本: ${version} ip: ${ip} 端口: ${port}`)
      return key
    }
    this.services.update(key, { timestamp })
    this.log.debug(`更新微服务: ${name}, 版本: ${version} ip: ${ip} 端口: ${port}`)
    return key
  }

  unregister(name, version, ip, port) {
    const key = `${name}${version}${ip}${port}`
    this.services.remove(this.services.to64(key))
    this.log.debug(`删除微服务: ${name}, 版本: ${version} ip: ${ip} 端口: ${port}`)
    return key
  }

  get(name, version) {
    this.expire()
    const candidate = pipe(filter(({ name: n, version: v })=> name === n && satisfies(v, version)), values)
    const services = candidate(this.services.get())
    // balance
    return services[Math.floor(Math.random() * services.length)]
  }

  parse64(str) {
    return new Buffer.from(str, 'base64').toString()
  }

  expire() {
    const now = Math.floor(new Date() / 1000)
    const keys = []
    forEachObjIndexed(({ timestamp }, key) => {
      if(timestamp + this.timeout < now) keys.push(key)
    }, this.services.get())
    this.services.remove(keys)
    if(keys.length) this.log.debug(`微服务 ${keys.map(item => this.parse64(item)).join(',')} 已过期`)
  }
}

module.exports = ServiceRegistry
