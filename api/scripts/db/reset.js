'use strict'

module.exports = function (app) {
  const db = app.get('sequelizeClient')

  console.log('Resetting all models...')

  const models = db.models
  Object.keys(models).forEach(name => {
    if ('associate' in models[name]) {
      models[name].associate(models)
    }
  })

  return db.sync({ force: true })
    .then(() => console.log('Successfully forcefully synced database'))
    .catch(err => console.error(err))
}
