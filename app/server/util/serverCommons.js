// (function () {
'use strict'

function handleServerResponse (reply, style) {
  return function (error, response) {
    // console.log('reply: ' + reply)
    // console.log('style: ' + style)
    // console.log('error: ' + error)
    // console.log('response: ' + response)

    if (response) {
      switch (style) {
        case 'View':
          reply.view(response.view, response.data)

          break

        case 'File':
          reply.file(response.name)

          break

        default:
          reply(response)

          break
      }
    } else if (error) {
      if (error instanceof Error) {
        reply(error)
      } else {
        reply(error.errorMsg).code(error.httpCode)
      }
    } else {
      reply('Resource Not Found!').code(404)
    }
  }
}

var fetchServerExports = function () {
  return require('./../hapiServer')
}
var appCommons = require('./../../util/appCommons')

function handleAppState (callback) {
  var serverExports = fetchServerExports()

  if (!serverExports.appState) {
    var viewData = require('')
    var appStartState = appCommons.jsFriendlyCopyJSON({
      'viewData': viewData
    })

    serverExports.appState = appStartState
  }

  return callback(serverExports.appState)
}

exports.handleAppState = handleAppState

exports.handleServerResponse = handleServerResponse

exports.fetchServerExports = fetchServerExports
// })()
