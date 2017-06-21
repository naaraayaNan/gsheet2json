// (function () {
'use strict'

var appCommons = require('./../../../util/appCommons')

function connect (context, callback) {
  if (!validMongoContext(context)) {
    callback(appCommons.wrapInCustomErrorObject('Invalid Mongo Context Detected!', 500), null)

    return
  }

  var handler = appCommons.handleCallback(callback)
  var mongoClient = require('mongodb').MongoClient

  mongoClient.connect(context.dbConfig.databaseURL, handler)
}

function createOperation (context, callback) {
  var databaseHandle = handleDatabase(context, callback)

  switch (context.actions.mode) {
    case 'bulk':
      context.connection.collection(context.dbConfig.collection).insertMany(context.dbConfig.query, databaseHandle)

      break

    default:
      context.connection.collection(context.dbConfig.collection).insertOne(context.dbConfig.query, databaseHandle)

      break
  }
}

function disconnect (database) {
  database.close()
}

function execute (context, callback) {
  if (!validAppContext(context)) {
    callback(appCommons.wrapInCustomErrorObject('Invalid App Context Detected!', 500), null)

    return
  }

  connect(context, function (error, database) {
    if (error) {
      callback(appCommons.wrapInCustomErrorObject(error.message, 500), null)

      return
    }

    context.connection = database

    switch (context.actions.task) {
      case 'create':
        createOperation(context, callback)

        break

      case 'update':
        updateOperation(context, callback)

        break

      default:
        searchOperation(context, callback)

        break
    }
  })
}

function formatResponse (context) {
  switch (context.actions.task) {
    case 'create':
      return (context.dbConfig.query)

    default:
      return (context.mongoDbOutcome)
  }
}

function handleDatabase (context, handler) {
  var failureWrapper = function (error, outcome) {
    handler(appCommons.wrapInCustomErrorObject('Error occurred while creating database callback wrapper with message: \n'.concat(error.message), 500), null)
  }
  var returnFunction = null

  ;(function () {
    var database = context.connection
    var callback = handler

    returnFunction = function (error, outcome) {
      context.mongoDbOutcome = outcome

      disconnect(database)
      callback((outcome) ? null : appCommons.wrapInCustomErrorObject(error.message, 500), (error) ? null : formatResponse(context))
    }
  })()

  return !returnFunction ? failureWrapper : returnFunction
}

function searchOperation (context, callback) {
  var databaseHandle = handleDatabase(context, callback)

  switch (context.actions.mode) {
    case 'unit':
      context.connection.collection(context.dbConfig.collection).find(context.dbConfig.query, { _id: 0 }).limit(1).next(databaseHandle)

      break

    default:
      context.connection.collection(context.dbConfig.collection).find(context.dbConfig.query, { _id: 0 }).limit(50).toArray(databaseHandle)

      break
  }
}

function updateOperation (context, callback) {
  var databaseHandle = handleDatabase(context, callback)

  switch (context.actions.mode) {
    case 'wipe':
      context.connection.collection(context.dbConfig.collection).findOneAndUpdate({
        'id': context.dbConfig.query
      }, {
        '$set': {
          'id': 'DLTD-'.concat(context.dbConfig.query)
        }
      }, {
        'returnOriginal': false
      }, databaseHandle)

      break

    default:
      context.connection.collection(context.dbConfig.collection).findOneAndUpdate({
        'id': context.dbConfig.query[0]
      }, {
        '$set': context.dbConfig.query[1]
      }, {
        'returnOriginal': false
      }, databaseHandle)

      break
  }
}

function validAppContext (context) {
  return (context.actions.task && context.actions.mode)
}

function validMongoContext (context) {
  return (context.dbConfig && context.dbConfig.databaseURL && context.dbConfig.collection)
}

exports.execute = execute
// })()
