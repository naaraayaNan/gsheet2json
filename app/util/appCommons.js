// (function () {
'use strict'

/**
 * CloneMe function based on the idea @ http://stackoverflow.com/a/4460624
 *
 * @param {any} input
 * @returns cloned object, same input or null
 */
function cloneMe (input) {
  if (!input) { // null, undefined values check
    return input
  }

  var types = [ Number, String, Boolean ]
  var result

  // normalizing primitives if someone did new String('aaa'), or new Number('444')
  types.forEach(function (type) {
    if (input instanceof type) {
      result = type(input)
    }
  })

  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(input) === '[object Array]') {
      result = []

      input.forEach(function (child, index) {
        result[index] = cloneMe(child)
      })
    } else if (typeof input === 'object') {
      // testing that this is DOM
      if (input.nodeType && typeof input.cloneNode === 'function') {
        result = input.cloneNode(true)
      } else if (!input.prototype) { // check that this is a literal
        if (input instanceof Date) {
          result = new Date(input)
        } else {
          // it is an object literal
          result = {}

          for (var key in input) {
            result[key] = cloneMe(input[key])
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        // if (false && input.constructor) {
        // would not advice to do that, reason? Read below
        // result = new input.constructor()
        // } else {
        result = input
      // }
      }
    } else {
      result = input
    }
  }

  return result
}

function copyJSON (input) {
  return JSON.parse(JSON.stringify(input))
}

/**
 * DeepCopy function based on the idea @ https://stackoverflow.com/a/728694
 *
 * @param {any} input
 * @returns cloned object, same input or null
 */
function deepCopy (input) {
  // Handle the 3 simple types, and null or undefined
  if (!input || typeof input !== 'object') {
    return input
  }

  // Handle Array
  if (Array.isArray(input)) {
    return input.map(function (value) {
      return deepCopy(value)
    })
  }

  // Handle Date
  if (input instanceof Date) {
    return new Date(input.getTime())
  }

  // Handle Object
  if (input instanceof Object) {
    var clone = {}

    for (var key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        clone[key] = (typeof input[key] === 'object') ? deepCopy(input[key]) : input[key]
      }
    }

    return clone
  }

  // throw new Error("Unable to copy obj! Its type isn't supported.")
  return null
}

function generateNumericUUID () {
  return require('crypto').randomBytes(32).swap32().readUInt32LE(0, 5)
}

function generateUUID () {
  return require('uuid').v4()
}

function handleCallback (callback) {
  return function (error, outcome) {
    callback((outcome) ? null : wrapInCustomErrorObject(error, '500'), (error) ? null : outcome)
  }
}

// function isFunctionType(input) {
//   return (input) ? Object.getPrototypeOf(input) === Function.prototype : false
// }

/**
 * Returns a JavaScript friendly copy using JSON APIs
 *
 * @param {any} input (any valid JSON object)
 * @returns a JavaScript friendly copy of input
 */
function jsFriendlyCopyJSON (input) {
  return JSON.parse(jsFriendlyJSONStringify(input))
}

/**
 * Returns a JavaScript friendly JSON.stringify() result
 *
 * @param {any} input
 */
function jsFriendlyJSONStringify (input) {
  return JSON.stringify(input).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

/**
 * Returns a JavaScript friendly pretty print version of prettifyMyJSON() result with desired indents
 *
 * @param {any} input (any valid JSON object)
 * @param {any} indent (any valid indent string or size as number)
 * @returns (a JavaScript friendly pretty print version of input)
 */
function jsFriendlyPrettifyMyJSON (input, indent) {
  return prettifyMyJSON(input, indent).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

/**
 * Returns a pretty print version of JSON.stringify() result with desired indents
 *
 * @param {any} input (any valid JSON object)
 * @param {any} indent (any valid indent string or size as number)
 * @returns (a pretty print version of input)
 */
function prettifyMyJSON (input, indent) {
  return JSON.stringify(input, undefined, indent)
}

function wrapInCustomErrorObject (errorMsg, httpCode) {
  return {
    'errorMsg': errorMsg,
    'httpCode': httpCode
  }
}

exports.cloneMe = cloneMe

exports.copyJSON = copyJSON

exports.deepCopy = deepCopy

exports.generateNumericUUID = generateNumericUUID

exports.generateUUID = generateUUID

exports.handleCallback = handleCallback

// exports.isFunctionType = isFunctionType

exports.jsFriendlyCopyJSON = jsFriendlyCopyJSON

exports.jsFriendlyJSONStringify = jsFriendlyJSONStringify

exports.jsFriendlyPrettifyMyJSON = jsFriendlyPrettifyMyJSON

exports.prettifyMyJSON = prettifyMyJSON

exports.wrapInCustomErrorObject = wrapInCustomErrorObject
// })()
