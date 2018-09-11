const fs = require('fs')
const { join, dirname } = require('path')
const mkdirp = require('mkdirp')
const config = require('./config.js').getConfig()

const getFilename = name => join(config.root, config.storagePath, name)
const getFile = name => {
  const filename = getFilename(name)
  try {
    return JSON.parse(fs.readFileSync(filename))
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
    mkdirp.sync(dirname(filename))
    fs.writeFileSync(filename, '{}')
    return {}
  }
}

const create = name => {
  return {
    data: getFile(name),
    save (x) {
      fs.writeFileSync(
        getFilename(name),
        JSON.stringify(x, null, 2)
      )
    }
  }
}

const cache = {}

module.exports = {
  create (name) {
    if (cache[name]) return cache[name]
    return cache[name] = create(name)
  }
}
