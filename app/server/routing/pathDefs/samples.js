// (function () {
'use strict'

var RequestHandler = require('./../../handlers/processRequest')

exports.sampleRoutes = [{
  'method': 'GET',
  'path': '/',
  'handler': function (request, reply) {
    reply('Hello, World! Welcome to GSheet2JSON web interface!\nUse /gSheet2JSON/montage for reaching app home...')
  }
}, {
  'method': 'GET',
  'path': '/{name}',
  'handler': function (request, reply) {
    reply('Hello, ' + decodeURI(encodeURIComponent(request.params.name)) + '!')
  }
}, {
  'method': 'GET',
  'path': '/test/getInfo/{credType}',
  'config': {
    'handler': RequestHandler.sampleResponse
  }
}]
// })()
