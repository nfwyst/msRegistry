const bunyan = require('bunyan')
const pkg = require('^package.json')

const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level, src: true })

module.exports = { getLogger, pkg }
