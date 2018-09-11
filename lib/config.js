const os = require('os')
const fs = require('fs')
const path = require('path')

let config

module.exports = {
  getConfig (fallback = {
    port: 3080,
    root: process.cwd(),
    storagePath: '.clay'
  }) {
    if (!config) config = getConfig(fallback)
    return config
  },
  saveConfig () {
    if (config) setConfig(config)
  }
}

const sysRoot = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/"
const getConfig = (fallback) => {
  let root = process.cwd()
  do {
    const file = path.join(root, 'package.json')
    try {
      const config = JSON.parse(fs.readFileSync(file)).config['@yesiree/clay']
      return Object.assign({}, fallback, config)
    } catch (e) {
      root = path.resolve(root, '..')
    }
  } while (root !== sysRoot)
  return {}
}

const setConfig = (config) => {
  let root = process.cwd()
  do {
    const file = path.join(root, 'package.json')
    try {
      const pkg = JSON.parse(fs.readFileSync(file))
      pkg.config = pkg.config || {}
      pkg.config['@yesiree/clay'] = config
      fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
    } catch (e) {
      root = path.resolve(root, '..')
    }
  } while (root !== sysRoot)
  throw Error(`Unable to save to 'package.json'. No package found.`)
}
