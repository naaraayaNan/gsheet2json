// (function () {
'use strict'

function sampleResponse (credType) {
  var sampleUserInfo = {
    'name': 'Narayanan R',
    'email': 'narayananr@outlook.in',
    'fame': 'Happy NodeJS Programmer!',
    'trail': 'Working on making one!',
    'game': 'RTS, FPS, TPS, RPG, MMORPG, arcade, board, puzzles...'
  }

  return ((sampleUserInfo.hasOwnProperty(credType)) ? sampleUserInfo[credType] : sampleUserInfo)
}

exports.sampleResponse = function (request, reply) {
  reply(sampleResponse(decodeURI(encodeURIComponent(request.params.credType))))
}
// })()
