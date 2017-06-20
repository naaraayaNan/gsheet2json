// (function () {
'use strict'

var AppCommons = require('./util/appCommons')
var GoogleAPIs = require('googleapis')

function validAuthContext (context) {
  return context.hasOwnProperty('authScopes')
}

/**
 * Async method that consumes 'context.authScopes' for authentication scope definition
 * and invokes callback upon successful authentication after setting 'context.gAuth'
 * and 'context.prjId' fields, else invokes callback with error details
 *
 * @param {any} context
 * @param {any} callback
 */
function wrapGAuthScope (context, callback) {
  if (!validAuthContext(context)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Auth Context Detected!', 500), null)

    return
  }

  GoogleAPIs.auth.getApplicationDefault(function (error, gAuth, prjId) {
    if (error) {
      callback(AppCommons.wrapInCustomErrorObject(error.message, 500), null)

      return
    }

    if (gAuth.createScopedRequired && gAuth.createScopedRequired()) {
      // Scopes can be specified either as an array or as a single, space-delimited string.
      gAuth = gAuth.createScoped(context.authScopes)
    }

    context.gAuth = gAuth
    context.prjId = prjId

    callback(null, context)
  })
}

exports.wrapGAuthScope = wrapGAuthScope
// })()
