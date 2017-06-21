// (function () {
'use strict'

var ConfigAPIs = require('./../../model/configAPIs')
var ServerCommons = require('./../util/serverCommons')

function listConfigurations (request, reply) {
  // console.log("POST /gSheet2JSON/configurations - listConfigurations handler function!")

  var context = {
    'payload': null,
    'actions': {
      'task': 'search',
      'mode': 'bulk'
    }
  }
  var serverResponse = ServerCommons.handleServerResponse(reply, null)

  ConfigAPIs.readOrListConfigurations(context, serverResponse)
}

function retrieveConfigById (request, reply) {
  // console.log("POST /gSheet2JSON/configurations/{configId} - retrieveConfigById handler function!")

  var context = {
    'payload': request.params.credentialId,
    'actions': {
      'task': 'search',
      'mode': 'unit'
    }
  }
  var serverResponse = ServerCommons.handleServerResponse(reply, null)

  ConfigAPIs.readOrListConfigurations(context, serverResponse)
}

function storeConfiguration (request, reply) {
  // console.log("POST /gSheet2JSON/configurations - storeConfiguration handler function!")

  var context = {
    'payload': request.payload,
    'actions': {
      'task': 'create',
      'mode': (Array.isArray(request.payload)) ? 'bulk' : 'unit'
    }
  }
  var serverResponse = ServerCommons.handleServerResponse(reply, null)

  ConfigAPIs.createOrUpdateConfiguration(context, serverResponse)
}

exports.configAPIsResponse = {
  'listConfigurations': listConfigurations,
  'retrieveConfigById': retrieveConfigById,
  'storeConfiguration': storeConfiguration
}
// })()
