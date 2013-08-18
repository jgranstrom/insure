###
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  Core insure.js implementation
###
do ->
  'use strict'

  disabled = false

  ###
    Mock insure instance object with mock API
  ###
  mockInsureObject =
    must: ->  mockInsureObject
    either: -> mockInsureObject

  ###
    Generate an error string for an assertion failure

    @param {string} clauseType The clause where the failure occurred
    @param {Number} variableIndex The index of a variable which caused
                    the failure
    @param {Object} variableValue The contents a variable which caused
                    the failure
    @param {Assertion | Array} assertion The assertion or array of
                    assertions that failed
  ###
  generateAssertionError = (clauseType, variableIndex, \
                            variableValue, asser) ->
    assertionMode = 0
    assertionMode = 1 if asser instanceof Assertion
    assertionMode = 2 if asser.length? and asser[0] instanceof Assertion

    if assertionMode is 2 and asser.length is 1
      asser = asser[0]
      assertionMode = 1

    if assertionMode < 2
      assertionString = if assertionMode is 0 then "no assertions" \
      else "assertion \"#{asser.displayName}\""
    else
      assertionString = "assertions\n:"
      assertionString += "\t#{a.displayName}\n" for a in asser

    "#{clauseType}-clause failed to insure state of variable with index \
    #{variableIndex} [value: #{variableValue}] for #{assertionString.trim()}"

  ###
    Throw an error for an assertion failure

    @param {string} clauseType The clause where the failure occurred
    @param {Number} variableIndex The index of a variable which
                    caused the failure
    @param {Object} variableValue The contents a variable which
                    caused the failure
    @param {Assertion | Array} assertion The assertion or array of
                    assertions that failed
  ###
  throwAssertionError = ->
    throw generateAssertionError(arguments...)

  ###
    Assertion instance

    @constructor
    @param {string} name The name of this assertion
    @param {function} assertionFunc The assertion callback function
    @param {string} [displayName] Optional display name if different from name
  ###
  class Assertion
    constructor: (@name, @assertionFunc, displayName) ->
      @displayName = displayName or name

    assert: =>
      @assertionFunc(arguments...)

  ###
    Inverted assertion instance which inherits from Assertion
    Creates an assertion with inverted assertion logic based
    on another assertion instance

    @constructor
    @param {Assertion} baseAssertion Base assertion to make inversion fo
  ###
  class InvertedAssertion extends Assertion
    constructor: (baseAssertion) ->
      super(baseAssertion.name, baseAssertion.assertionFunc,
        "not #{baseAssertion.displayName}")

    assert: =>
      not super(arguments...)

  ###
    Insure instance

    @constructor
    @param {[string]} variables The underlying variables for this InsureObject
  ###
  class InsureObject
    constructor: (@variables) ->

    ###
      Make assertions for the variables of this instance
      All assertions must be satisfied

      @param {...Assertion} Assertions to make
      @return Current insure instance
    ###
    must: =>
      return this if disabled

      for variable, i in @variables
        for assertion in arguments when not assertion.assert(variable)
          throwAssertionError("must", i, variable, assertion)

      this

    ###
      Make assertions for the variables of this instance
      At least one assertion must be satisfied per variable

      @param {...Assertion} Assertions to make
      @return Current insure instance
    ###
    either: =>
      return this if disabled

      for variable, i in @variables
        if true not in (assertion.assert(variable) for assertion in arguments)
          throwAssertionError('either', i, variable, arguments)

      this

  ###
    Global insure function

    @param {...object} Variable to make assertions upon
    @return {InsureObject | object} New insure instance
  ###
  insure = ->
    return mockInsureObject if disabled

    new InsureObject(arguments)

    # Assertions registered dynamically to insure object

  insure.not = {
    # Inverted assertions registered dynamically to insure.not object
  }

  ###
    Register an assertion with name and assertion callback
    Throws exception if assertion name already exists

    @param {string} assertionName Name of the assertion to register
    @param {function} assertionFunc The assertion callback function
    @return {object} Insure object for chaining
  ###
  insure.registerAssertion = (assertionName, assertionFunc) ->
    return insure if disabled

    if insure[assertionName]?
      throw new Error("Cannot register assertion since an assertion \
      with the same name already exists")

    assertion = new Assertion(assertionName, assertionFunc)

    insure[assertionName] = assertion
    insure.not[assertionName] = new InvertedAssertion(assertion)

    insure

  ###
    Call to disable all assertions
    All type-checking will be bypassed silently without breaking
    implementations, call on initialization phase if in production environment
  ###
  insure.disable = -> disabled = true

  ###
    Export insure as node module or on window object
  ###
  if module?.exports?
    module.exports = insure

    ###
      Require assertions if node module
    ###
    require './insure.assertions.js'
  else
    window.insure ?= insure