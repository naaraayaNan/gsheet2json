(function () {
  'use strict'

  var context = {}
  var GSHEETLINK = 'https://docs.google.com/spreadsheets/d/1qpwylbiZZx_SzjplrM8MPFxk-_NuaPIGnUFZGSGB-IA/edit?usp=sharing'
  var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
  var TransformerAPI = require('./../transformation')
  var gSheetArgIndex = process.argv.indexOf('--gSheetLink')
  var authScopesArgIndex = process.argv.indexOf('--authScopes')
  var helpArgIndex = process.argv.indexOf('--help')

  // console.log(process.argv)

  if (helpArgIndex !== -1 || gSheetArgIndex > authScopesArgIndex || (gSheetArgIndex !== -1 && authScopesArgIndex !== -1 && (authScopesArgIndex - gSheetArgIndex !== 2))) {
    console.log('Usage:\n\tnode [path]readGsheet.js [--gSheetLink <GSheet-Hyperlink> --authScopes <space-delimited list of scopes>] | [--help]\n\nNOTE: authScopes argument must be the last one, if present, followed by the valid scopes values\n\nScope Values are one or more of:\n\thttps://www.googleapis.com/auth/spreadsheets.readonly \tAllows read-only access to the user\'s sheets and their properties.\n\thttps://www.googleapis.com/auth/spreadsheets \t\tAllows read/write access to the user\'s sheets and their properties.\n\thttps://www.googleapis.com/auth/drive.readonly \t\tAllows read-only access to the user\'s file metadata and file content.\n\thttps://www.googleapis.com/auth/drive.file \t\tPer-file access to files created or opened by the app.\n\thttps://www.googleapis.com/auth/drive \t\t\tFull, permissive scope to access all of a user\'s files. Request this scope only when it is strictly necessary.\n\n\t\t\tTerminating the task for now!! Retry as instructed...')

    return
  }

  if (gSheetArgIndex !== -1) { // does our flag exist?
    context.gSheetLink = process.argv[gSheetArgIndex + 1] // grab the next item
    console.log('Using GSheet Link: %s', context.gSheetLink)
  } else {
    console.log('Setting Sample GSheet Link!')
    context.gSheetLink = GSHEETLINK
  }

  if (authScopesArgIndex !== -1) { // does our flag exist?
    var authScopesDataIndex = authScopesArgIndex + 1

    context.authScopes = []

    do {
      context.authScopes.push(process.argv[authScopesDataIndex++]) // grab the next item
    } while (authScopesDataIndex < process.argv.length)

    console.log('Using Sheets Auth Scopes: %s', context.authScopes)
  } else {
    console.log('Setting Sheets.READ-ONLY authScope!')
    context.authScopes = SCOPES
  }

  TransformerAPI.convertGSheet2JSON(context, function (error, outcome) {
    if (error) {
      throw error
    }

    if (outcome) {
      if (outcome.gSheetData && outcome.gSheetData.values) {
        console.log('Successfully read: '.concat(GSHEETLINK).concat('\n'))
        outcome.gSheetData.values.forEach(function (value) {
          console.log('%s', value)
        })
      } else {
        console.log('Failed to read: '.concat(GSHEETLINK).concat('\n'))
      }

      if (outcome.configJSON) {
        console.log('Converted JSON is:\n', outcome.configJSON)
      } else {
        console.log('Conversion to JSON Failed!\n')
      }
    }
  })
})()
