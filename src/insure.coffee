do ->
  'use strict';

  disabled = false

  mockInsureObject =
    must: ->  mockInsureObject
    either: -> mockInsureObject

  generateAssertionError = (clauseType, variableIndex, variableValue, assertion) ->
    assertionMode = 0
    assertionMode = 1 if assertion instanceof Assertion
    assertionMode = 2 if assertion?.length? and assertion[0] instanceof Assertion

    if assertionMode is 2 and assertion.length is 1
      assertion = assertion[0]
      assertionMode = 1

    if assertionMode < 2
      assertionString = if assertionMode is 0 then "no assertions" else "assertion \"#{assertion.displayName}\""
    else
      assertionString = "assertions\n:"
      assertionString += "\t#{a.displayName}\n" for a in assertion

    "#{clauseType}-clause failed to insure state of variable with index #{variableIndex}
 [value: #{variableValue}] for #{assertionString.trim()}"


  throwAssertionError = ->
    throw generateAssertionError(arguments...);

  class Assertion
    constructor: (@name, @assertionFunc, displayName) ->
      @displayName = displayName or name

    assert: =>
      @assertionFunc(arguments...)

  class InvertedAssertion extends Assertion
    constructor: (baseAssertion) ->
      super(baseAssertion.name, baseAssertion.assertionFunc, "not #{baseAssertion.displayName}")

    assert: =>
      not super(arguments...)

  class InsureObject
    constructor: (@variables) ->

    must: =>
      return this if disabled

      for variable, i in @variables
        for assertion in arguments when not assertion.assert(variable)
          throwAssertionError("must", i, variable, assertion)

      this

    either: =>
      return this if disabled

      for variable, i in @variables
        if true not in (assertion.assert(variable) for assertion in arguments)
          throwAssertionError('either', i, variable, arguments)

      this

  insure = ->
    return mockInsureObject if disabled

    new InsureObject(arguments)

  insure.not = {}

  insure.registerAssertion = (assertionName, assertionFunc) ->
    return insure if disabled

    if insure[assertionName]?
      throw new Error("Cannot register assertion since an assertion with the same name already exists");

    assertion = new Assertion(assertionName, assertionFunc)

    insure[assertionName] = assertion;
    insure.not[assertionName] = new InvertedAssertion(assertion)

    insure

  insure.disable = -> disabled = true

  if module?.exports?
    module.exports = insure

    require './insure.refactor.assertions.js'
  else
    window.insure ?= insure