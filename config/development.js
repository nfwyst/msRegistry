const { getLogger, pkg: { name, version } } = require('./share')

module.exports = {
  log: () => getLogger(name, version, 'debug'),
  proxy: false
}
