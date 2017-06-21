// (function () {
'use strict'

var Hapi = require('hapi')
var appServer = new Hapi.Server()

appServer.connection({
  host: '127.0.0.1',
  port: 55555
})

var AppRoutes = require('./routing/paths').activeRoutes
var Good = require('good')

appServer.route(AppRoutes)
appServer.register({
  'register': Good,
  'options': {
    'reporters': {
      'console': [{
        'module': 'good-squeeze',
        'name': 'Squeeze',
        'args': [{
          'response': '*',
          'log': '*'
        }]
      }, {
        'module': 'good-console'
      }, 'stdout']
    }
  }
}, function (err) {
  if (err) {
    throw err
  }

  appServer.start(function (err) {
    if (err) {
      throw err
    }

    appServer.log('info', 'appServer running at: ' + appServer.info.uri)
  })
})

exports.logItAs = appServer.log()
// })()
