'use strict'

const { spawn } = require('child_process')

const webpack = require('webpack')
const moment = require('moment')
const chokidar = require('chokidar')
const exec = require('child_process').exec;

const config = require('./webpack.config.js')

const clientConfig = config({ platform: 'browser' })
const serverConfig = config({ platform: 'node' })

const clientCompiler = webpack(clientConfig)
const serverCompiler = webpack(serverConfig)

const onlyErrorsAndWarnings = {
  chunks: false,
  assets: false,
  timings: false,
  hash: false,
  version: false,
  colors: true
}

const handleErr = (err) => {
  console.error(err.stack || err)

  if (err.details) {
    console.error(err.details)
  }

  return
}

const getTime = () => moment().format('HH:mm:ss')

// see: https://github.com/webpack/webpack/issues/4686#issuecomment-292880719
let lastHashes = {
  server: '',
  client: ''
}

const logger = (platform) => (stats) => {
  const info = stats.toJson()
  const shortHash = info.hash.substring(0,7)

  if (lastHashes[platform] === info.hash) {
    console.log(`Bailing duplicate logging for ${shortHash}`)
    return
  } else {
    lastHashes[platform] = info.hash
  }

  console.log([
    `[${getTime()}]`,
    `[${shortHash}]`,
    `${platform} ${stats.hasErrors() ? 'failed' : 'built'} in ${info.time}ms`
  ].join(' '))

  if (stats.hasErrors() || stats.hasWarnings()) {
    console.log(stats.toString(onlyErrorsAndWarnings))
  }
}

let cp

const compileServer = () => {
  serverCompiler.run((err, stats) => {
    if (err) {
      return handleErr(err)
    }

    logger('server')(stats)

    if (cp) {
      console.log(`[${getTime()}] Restarting server`)
      // send SIGTERM
      cp.kill()
    } else {
      console.log(`[${getTime()}] Starting server`)
    }

    cp = spawn('node', [ './bin/www' ])

    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stderr)
    // Not sure why this is not ever called
    cp.on('close', (code) => `CP exited with code ${code}`)

    exec("npm run dist:clean", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  })
}

clientCompiler.watch({}, (err, stats) => {
  if (err) {
    return handleErr(err)
  }

  logger('client')(stats)

  if (!stats.hasErrors()) {
    compileServer()
  }
})

chokidar.watch('./src/server.js').on('change', compileServer)

