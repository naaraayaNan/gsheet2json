// (function () {
'use strict'

var ConfAPIsRoutes = require('./pathDefs/confAPIs').confAPIsRoutes
var SampleRoutes = require('./pathDefs/samples').sampleRoutes

exports.activeRoutes = ConfAPIsRoutes.concat(SampleRoutes)
// })()
