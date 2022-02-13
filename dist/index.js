
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./heliaia.cjs.production.min.js')
} else {
  module.exports = require('./heliaia.cjs.development.js')
}
