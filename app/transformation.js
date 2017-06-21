// (function () {
'use strict'

var AppCommons = require('./util/appCommons')
var GSheetsAPIv4 = require('googleapis').sheets('v4')
var wrapGAuthScope = require('./authentication').wrapGAuthScope

/**
 * Async method to convert the Google Sheet from hyperlink obtained
 * through 'context.gSheetLink' field to JSON and return the result
 * through 'context.configJSON' field by invoking the callback method
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
 * through 'context.configJSON' field to Google Sheet and return the
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

function gatherGSheetData (context, handler) {
  var callback = AppCommons.handleCallback(handler)

  if (!validReadContext(context)) {
    callback(AppCommons.wrapInCustomErrorObject('Invalid Read Context Detected!', 500), null)

    return
  }

  // Parse the UUID of the spreadsheet from the regEx's second block match (at index '1')
  context.gSheetId = context.gSheetLink.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//)[1]

  fetchWorksheetName(context, callback)
}

function fetchGSheetData (context, callback) {
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
}

function fetchWorksheetName (context, callback) {
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

    // Setting the range to the sheet name to fetch all data!
    context.contentRange = outcome.sheets[0].properties.title

    fetchGSheetData(context, callback)
  })
}

function isConversionDone (context) {
  // Comparing with total data rows in the input sans the header row
  return Object.keys(context.configJSON).length === context.gSheetData.values.length - 1
}

function processGSheetData (context, callback) {
  var dataRows = context.gSheetData.values
  var headers = dataRows[0] // Considering the first row of data as headers

  function buildActionString (array) {
    return '|'.concat((/[Rr]eview/).test(cellDataForHeader(array, 'SV buttons')) ? 'SV_FR' : 'SV_RO_CL').concat('|').concat((/[Cc]ertify/).test(cellDataForHeader(array, 'SL buttons')) ? 'SL_OS_0' : 'SL_NA')
  }

  function cellDataForHeader (array, title) {
    var index = headers.indexOf(title)
    var data = (index < array.length) ? array[index] : null

    // Clearing out unsightly line breaks, if any, within non-empty text
    return (data) ? data.replace(/\r?\n|\r/g, ' ') : ''
  }

  /**
   * Mapping the columns of each row to appropriate JSON keys as values.
   * TODO: Implement the mapping in a completely generic manner
   *
   * The mapping rule (as inferred from the specification and data samples) is:
   * {
   *   "actor": Col(Actor),
   *   "CL": Col(CL),
   *   "stage":"S"+ Col(Stage),
   *   "action" = Col(Action) + "|" + fn(CL Buttons)
   *   "node_display_name": Col(Name),
   *   "snag_filter": Col(Filter)
   * }
   *
   * where:
   *  fn(CL Buttons) = if (<CL Buttons> contains "Submit") then "|SV_NA|SL_NA" else ”|” + fn(SV buttons) + “|” + fn(SL buttons)
   *  fn(SV buttons) = if(<SV buttons> contains “review”) then SV_FR else SV_RO_CL
   *  fn(SL buttons) = if(<SL buttons> contains “certify”) then SL_OS_0 else SL_NA
   *
   * @param {any} rowData
   * @param {any} asyncHandler
   */
  function mapTheData (rowData, asyncHandler) {
    asyncHandler({
      'actor': cellDataForHeader(rowData, 'Actor'),
      'CL': cellDataForHeader(rowData, 'CL'),
      'stage': 'S'.concat(cellDataForHeader(rowData, 'Stage')),
      'action': cellDataForHeader(rowData, 'Action').concat((cellDataForHeader(rowData, 'CL Buttons') === 'Submit') ? '|SV_NA|SL_NA' : buildActionString(rowData)),
      'node_display_name': cellDataForHeader(rowData, 'Name'),
      'snag_filter': cellDataForHeader(rowData, 'Filter')
    })
  }

  context.configJSON = {}

  dataRows.forEach(function (rowData, colIndex) {
    if (colIndex !== 0) {
      mapTheData(rowData, function (rowObject) {
        context.configJSON[cellDataForHeader(rowData, 'T')] = rowObject

        // Condition to collate the async mappings and return the results!
        if (isConversionDone(context)) {
          callback(null, context)
        }
      })
    }
  })
}

function validGSheetInput (gSheetObject) {
  // Enforcing single-worksheet spreadsheets
  return gSheetObject.sheets.length === 1
}

function validReadContext (context) {
  return context.hasOwnProperty('gAuth') && context.gAuth &&
    context.hasOwnProperty('gSheetLink') && context.gSheetLink
}

exports.convertGSheet2JSON = convertGSheet2JSON

exports.convertJSON2GSheet = convertJSON2GSheet
// })()
