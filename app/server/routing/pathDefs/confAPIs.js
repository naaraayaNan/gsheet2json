// (function () {
'use strict'

var ConfigAPIsResponse = require('./../../handlers/processConfAPI').configAPIsResponse

exports.confAPIsRoutes = [{
  'method': 'GET',
  'path': '/gSheet2JSON/configurations',
  'config': {
    'handler': ConfigAPIsResponse.listConfigurations
  }
}, {
  'method': 'GET',
  'path': '/gSheet2JSON/configurations/{configId}',
  'config': {
    'handler': ConfigAPIsResponse.retrieveConfigById
  }
}, {
  'method': 'POST',
  'path': '/gSheet2JSON/configurations',
  'config': {
    'handler': ConfigAPIsResponse.storeConfiguration
  }
}]
// })()
