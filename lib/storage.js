const fs = require('fs')
const path = require('path')

const createProxy = (filename) => {
  const store = require(filename)
  const handler = {
    get (target, name) {
      if (target[name] instanceof Proxy) return target[name]
      if (typeof target[name] === 'object') return new Proxy(target[name], handler)
      return target[name]
    },
    set (target, name, value) {
      if(typeof value === 'object') {
        target[name] = new Proxy(value, handler)
      } else {
        target[name] = value
      }
    }
  }
  return new Proxy(store, handler)
}

const apiFilename = path.join(__dirname, 'data/api.json')
const authFilename = path.join(__dirname, 'data/auth.json')

module.exports = {
  apiStore: {
    data: require(apiFilename),
    save (x) {
      fs.writeFileSync(apiFilename, JSON.stringify(this.data, null, 2))
    }
  },
  authStore: {
    data: require(authFilename),
    save () {
      fs.writeFileSync(authFilename, JSON.stringify(this.data, null, 2))
    }
  }
}
