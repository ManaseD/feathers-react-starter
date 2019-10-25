import path from 'path'
import fs from 'fs'
import express from '@feathersjs/express'

import webpackConfig from '../webpack.config.js'

'use strict'

// === CONFIG ===
const envalid = require('envalid')
const { str, num } = envalid

const env = envalid.cleanEnv(process.env, {
  API_BASE_URL: str(),
  INTERNAL_API_BASE_URL: str(),
  LOG_FORMAT: str({ default: 'short' }),
  NODE_ENV: str({ devDefault: 'development' }),
  PORT: num(),
})

const app = express()

// Get absolute path to dist folder where webpack places built assets
const distributionPath = webpackConfig({ platform: 'browser' }).output.path
const htmlTemplateContents = fs.readFileSync(path.resolve(distributionPath, '_index.html'), 'utf8')
const htmlTemplate = ({ app }) => htmlTemplateContents.replace('{{ APP }}', app)

// Fallback to express to serve statics (after nginx)
app.use(express.static(distributionPath))

// Hack to avoid returning SPA on phantom request
app.get('/undefined', (req, res) => res.status(404).end('Not found'))

app.get('/*', (req, res) => res.send(htmlTemplate({ app: '' })))

// Log errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  next(err)
})

app.use(express.errorHandler())

app.listen(env.PORT, () => console.log(`Express server listening on ${env.PORT}`))
