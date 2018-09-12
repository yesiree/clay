const path = require('path')
const express = require('express')
const HttpError = require('./error.js')
const bodyParser = require('body-parser')
const { authRoutes } = require('./auth/routes.js')
const { apiRoutes } = require('./api/routes')
const config = require('./config').getConfig()
const app = express()

app.use(bodyParser.json())
app.get('/ping', (req, res) => res.json({ message: 'pong', timestamp: new Date() }))
if (config.websitePath) {
  app.use(express.static(config.websitePath))
}
app.use('/auth/', authRoutes)
app.use('/api/', apiRoutes)
// app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../www/index.html')))
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.code).json({
      code: err.code,
      status: err.status,
      message: err.message
    })
  } else {
    console.error(err)
    res.status(500).json({
      message: err.message,
      stack: err.stack.split('\n')
    })
  }
})

module.exports = {
  start () {
    app.listen(config.port, () => {
      console.log(`  Listening at localhost:${config.port}...`)
    })
  }
}
