'use strict'

var context = {}
var GSHEETLINK = 'https://docs.google.com/spreadsheets/d/1qpwylbiZZx_SzjplrM8MPFxk-_NuaPIGnUFZGSGB-IA/edit?usp=sharing'
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
var transformerAPI = require('./../transformation')

context.gSheetLink = GSHEETLINK
context.authScopes = SCOPES

transformerAPI.convertGSheet2JSON(context, function (error, outcome) {
  if (error) {
    throw error
  }

  if (outcome) {
    if (outcome.gSheetData && outcome.gSheetData.values) {
      console.log('Successfully read '.concat(GSHEETLINK).concat('\n'))
      outcome.gSheetData.values.forEach(function (value) {
        console.log(value.toString(' '))
      })
    } else {
      console.log('Failed to read '.concat(GSHEETLINK).concat('\n'))
    }

    if (outcome.jsonData) {
      console.log('Converted JSON is:\n', outcome.jsonData)
    } else {
      console.log('Conversion to JSON Failed\n')
    }
  }
})
