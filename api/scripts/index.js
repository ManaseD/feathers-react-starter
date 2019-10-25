'use strict'

// USAGE:
// node scripts/index.js scriptName anotherScript
// where ./scripts/scriptName.js and ./scripts/anotherScript.js exist
// and anotherScript will be ran after scriptName finishes
// Scripts should return a Promise if they want to be async

const path = require('path')
const Promise = require('bluebird')

// Import the API subapp
const app = require('../src/app.js')

// Map arguments to requires in current folder
const scripts = process.argv.slice(2).map(file => require(path.resolve(__dirname, file + '.js')))

Promise.mapSeries(scripts, script => script(app))
  .catch(err => console.error('Error in scripts: ', err))
  .then(() => console.log('Scripts ran'))
  .then(() => app.get('sequelizeClient').close())
  .then(() => process.exit())
