import feathers from '@feathersjs/client'
import rest from '@feathersjs/rest-client'
import fetch from 'isomorphic-fetch'

import { BASE_URL } from './constants'

const app = feathers()
const api = rest(BASE_URL).fetch(fetch)

app.configure(api)
app.configure(feathers.authentication())

export { app as default }
