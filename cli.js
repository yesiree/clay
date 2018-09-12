#!/usr/bin/env node

const getopts = require('getopts')
const { getConfig, saveConfig } = require('./lib/config.js')

const args = getopts(process.argv, {
  boolean: ['init'],
  default: {
    init: false
  }
})

const opts = {
  init: args['_'].indexOf('init') !== -1,

}

if (opts.init) {
  // create and save config object
  const config = {}
} else {
  // run clay
  const server = require('./lib/server.js')
  const config = getConfig()
  server.start()
}


