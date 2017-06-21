// (function () {
'use strict'

var AppCommons = require('./../util/appCommons')
var MongoDB = require('./data/mongo/dbConnector')
var TransformerAPI = require('./../transformation')

function createOrUpdateConfiguration (context, callback) {
  if (!validModelContext(context)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Model Context Detected!', 500), null)

    return
  }

  var payload = context.payload

  if (!isValidInput(context.actions.task, payload)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Payload Detected!', 400), null)

    return
  }

  context.gSheetLink = payload.gSheetLink
  context.authScopes = payload.authScopes
  context.configTags = (!payload.configTags) ? [] : payload.configTags

  TransformerAPI.convertGSheet2JSON(context, function (error, outcome) {
    if (error) {
      callback(AppCommons.wrapInCustomErrorObject(error.msgText, error.httpCode), null)

      return
    }

    if (!outcome.configJSON) {
      callback(AppCommons.wrapInCustomErrorObject('Conversion to JSON failed unexpectedly!', 500), null)

      return
    }

    context.dbConfig = {
      'query': {
        'id': AppCommons.generateNumericUUID(),
        'configTags': outcome.configTags,
        'configData': outcome.configJSON,
        'uploadTime': (new Date()).toUTCString()
      }
    }

    fetchDbDetails(context)
    MongoDB.execute(context, callback)
  })
}

function fetchDbDetails (context) {
  var mongoConfig = require('./../conf/data/storeDef.json')

  context.dbConfig.databaseURL = mongoConfig.mongoURL.concat(mongoConfig.gSheet2JSON.database)
  context.dbConfig.collection = mongoConfig.gSheet2JSON.collections.configData
}

function isValidInput (mode, data) {
  var inputValid = false

  switch (mode) {
    case 'create':
      inputValid = validateCreate(data)

      break

    case 'update':
      inputValid = validateUpdate(data)

      break

    default:
      inputValid = true

      break
  }

  return inputValid
}

function readOrListConfigurations (context, callback) {
  if (!validModelContext(context)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Context Detected!', 500), null)

    return
  }

  var payload = context.payload

  if (!isValidInput(context.actions.task, payload)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Payload Detected!', 400), null)

    return
  }

  context.dbConfig = {
    'query': (payload) ? {
      'id': payload
    } : {}
  }

  fetchDbDetails(context)
  MongoDB.execute(context, callback)
}

function validateCreate (data) {
  return (Array.isArray(data))
    ? data.filter(function (item) {
      return !validateInput(item)
    }).length === 0
    : validateInput(data)
}

function validateInput (item) {
  var hasOwnGSheetLink = item.hasOwnProperty('gSheetLink')
  var hasOwnAuthScopes = item.hasOwnProperty('authScopes')

  return (hasOwnGSheetLink && hasOwnAuthScopes)
}

function validateUpdate (data) {
  return (Array.isArray(data))
    ? data.filter(function (item, index) {
      return !((index === 0 && (item && item instanceof String)) || (item && !Array.isArray(item)))
    }).length === 0
    : (data && data instanceof String)
}

function validModelContext (context) {
  var hasOwnActions = context.hasOwnProperty('actions')
  var hasOwnPayload = context.hasOwnProperty('payload')

  return (hasOwnPayload && hasOwnActions)
}

exports.createOrUpdateConfiguration = createOrUpdateConfiguration

exports.readOrListConfigurations = readOrListConfigurations
// })()
