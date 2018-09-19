const fs = require('fs')
const { join, dirname } = require('path')
const mkdirp = require('mkdirp')
const config = require('./config.js').get()

const getFilename = name => {
  return join(config.root, config.storagePath, name)
}
const getFile = (name, fallback) => {
  const filename = getFilename(name)
  try {
    return JSON.parse(fs.readFileSync(filename))
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
    mkdirp.sync(dirname(filename))
    fs.writeFileSync(filename, JSON.stringify(fallback))
    return fallback
  }
}

const create = (name, fallback = {}) => {
  return {
    data: getFile(name, fallback),
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
