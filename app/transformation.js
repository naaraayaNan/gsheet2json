// (function () {
'use strict'

var AppCommons = require('./util/appCommons')
var GSheetsAPIv4 = require('googleapis').sheets('v4')
var wrapGAuthScope = require('./authentication').wrapGAuthScope

/**
 * Async method to convert the Google Sheet from hyperlink obtained
 * through 'context.gSheetLink' field to JSON and return the result
 * through 'context.jsonData' field by invoking the callback method
 *
 * @param {any} context
 * @param {any} callback
 */
function convertGSheet2JSON (context, callback) {
  wrapGAuthScope(context, function (error, outcome) {
    if (error) {
      callback(AppCommons.wrapInCustomErrorObject(error.message, 500), null)

      return
    }

    gatherGSheetData(outcome, callback)
  })
}

/**
 * Async method to convert the JSON representation data obtained
 * through 'context.jsonData' field to Google Sheet and return the
 * result through 'context.gSheetLink' field via the callback method
 *
 * @param {any} context
 * @param {any} callback
 */
function convertJSON2GSheet (context, callback) {
  // if (!validWriteContext(context)) {
  //   callback(appCommons.wrapInCustomErrorObject('Invalid context detected!', 500), null)

  //   return
  // }
  // // TODO: logic to rebuild sheets data and write it somewhere and get its hyperlink
  // callback(null, context)
}

function extractGSheetIdFromItsLink (context) {
  // Pick the second block match from index '1' for extracting the spreadsheet UUID alone
  context.gSheetId = context.gSheetLink.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//)[1]
}

function gatherGSheetData (context, callback) {
  if (!validReadContext(context)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Read Context Detected!', 500), null)

    return
  }

  extractGSheetIdFromItsLink(context)

  // Calling the 'spreadsheets.get' API for sheet details
  GSheetsAPIv4.spreadsheets.get({
    auth: context.gAuth,
    spreadsheetId: context.gSheetId
  }, function (error, outcome) {
    if (error) {
      callback(AppCommons.wrapInCustomErrorObject(error.message, 500), null)

      return
    }

    if (!validGSheetInput(outcome)) {
      callback(AppCommons.wrapInCustomErrorObject('Invalid Spreadsheet Input Detected!', 400), null)

      return
    }

    // Setting the range to the sheet name to fetch all data
    context.contentRange = outcome.sheets[0].properties.title

    // Calling the 'spreadsheets.values.get' API for sheet values
    GSheetsAPIv4.spreadsheets.values.get({
      auth: context.gAuth,
      spreadsheetId: context.gSheetId,
      range: context.contentRange
    }, function (error, outcome) {
      if (error) {
        callback(AppCommons.wrapInCustomErrorObject(error.message, 500), null)

        return
      }

      context.gSheetData = outcome

      processGSheetData(context, callback)
    })
  })
}

function processGSheetData (context, callback) {
  var rows = context.gSheetData.values
  var headers = rows[0] // Considering the first row of data as header
  var keyColumnId = -1
  var jsonData = {}
  var actionDelimiter = '|'

  headers.forEach(function (title, index) {
    if (title === 'T') {
      keyColumnId = index
    }
  })

  if (rows.length === 0) {
    context.response = 'No data to process!! Quitting...'
  } else {
    rows.forEach(function (row, index) {
      if (!(index === 0)) {
        var rowObject = {}
        var slActionString = ''

        row.forEach(function (data, index) {
          // Clearing out unsightly line breaks
          data = data.replace(/\r?\n|\r/g, ' ')

          switch (index) {
            case 0:
              rowObject.stage = 'S'.concat(data)

              break

            case 3:
              rowObject.node_display_name = data

              break

            case 4:
              rowObject.actor = data

              break

            case 5:
              rowObject.action = data

              break

            case 6:
              rowObject.CL = data

              break

            case 8:
              rowObject.snag_filter = data

              break

            case 9:
              slActionString += actionDelimiter.concat((/[Cc]ertify/).test(data) ? 'SL_OS_0' : 'SL_NA')

              break

            case 10:
              rowObject.action += actionDelimiter.concat((/[Rr]eview/).test(data) ? 'SV_FR' : 'SV_RO_CL').concat(slActionString)

              break

            default:
              // Do nothing

              break
          }
        })

        jsonData[row[keyColumnId]] = rowObject
      }
    })

    context.jsonData = jsonData
  }

  callback(null, context)
}

function validGSheetInput (gSheetObject) {
  return gSheetObject.sheets.length === 1
}

function validReadContext (context) {
  return context.hasOwnProperty('gAuth') && context.gAuth &&
    context.hasOwnProperty('gSheetLink') && context.gSheetLink
}

exports.convertGSheet2JSON = convertGSheet2JSON

exports.convertJSON2GSheet = convertJSON2GSheet
// })()
