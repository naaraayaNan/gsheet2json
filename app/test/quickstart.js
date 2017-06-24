'use strict'

var google = require('googleapis')
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

google.auth.getApplicationDefault(function (err, authClient, projectId) {
  if (err) {
    throw err
  }

  // The createScopedRequired method returns true when running on GAE or a local developer
  // machine. In that case, the desired scopes must be passed in manually. When the code is
  // running in GCE or a Managed VM, the scopes are pulled from the GCE metadata server.
  // See https://cloud.google.com/compute/docs/authentication for more information.
  if (authClient.createScopedRequired && authClient.createScopedRequired()) {
    // Scopes can be specified either as an array or as a single, space-delimited string.
    authClient = authClient.createScoped(SCOPES)
  }

  showData(authClient)
})

/**
 * Print all data in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function showData (authClient) {
  var sampleSheet = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  var sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data'
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }
    console.log('Reading the link %s\n', sampleSheet)
    var rows = response.values
    if (rows.length === 0) {
      console.log('No data found.')
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i]
        console.log('%s', row)
      }
    }
  })
}
