const express = require('express')
const ServiceRegistry = require('^server/lib/ServiceRegistry')

const service = express()

module.exports = (config) => {
  const log = config.log()
  const serviceRegistry = new ServiceRegistry(log, config.get('serviceTimeout'))

  if(config.get('proxy')) service.set('trust proxy')

  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`)
      return next()
    })
  }

  service.put('/microservice/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params
    const addr = req.connection.remoteAddress
    const ip = addr.includes('::') ? `[${addr}]` : addr
    const key = serviceRegistry.register(name, version, ip, port)
    return res.json({ errCode: 200, result: key })
  })

  service.delete('/microservice/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params
    const addr = req.connection.remoteAddress
    const ip = addr.includes('::') ? `[${addr}]` : addr
    const key = serviceRegistry.unregister(name, version, ip, port)
    return res.json({ errCode: 200, result: key })
  })

  service.get('/microservice/find/:name/:version', (req, res, next) => {
    const { name, version } = req.params
    const service = serviceRegistry.get(name, version)
    if(!service) return next()
    return res.json({
      errCode: 200,
      result: service
    })
  })

  service.use((req, res, next) => {
    return res.status(404).json({
      errCode: 404,
      errMsg: 'not found'
    })
  })

  service.use((error, req, res, next) => {
    const code = error.status || 500
    res.status(code)
    log.error(error)
    return res.json({
      errCode: code,
      errMsg: error.message
    })
  })

  return service
}
