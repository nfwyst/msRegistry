const { getLogger, pkg: { name, version } } = require('./share')

module.exports = {
  name,
  version,
  serviceTimeout: 30,
  port: 3000,
  log: () => getLogger(name, version, 'fatal'),
}
