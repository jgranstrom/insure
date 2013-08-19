###
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  Mock production insure.js shell implementation
###
do ->
  'use strict'

  ###
    Mock insure instance object with mock API
  ###
  mockInsureObject =
    must: ->  mockInsureObject
    either: -> mockInsureObject

  ###
    Mock global insure object
  ###
  insure = ->
    mockInsureObject

  ###
    Mock not-object
  ###
  insure.not = {}

  ###
    Mock register function
  ###
  insure.registerAssertion = -> insure

  ###
    Mock disable function
    Production shell disabled by default
  ###
  insure.disable = ->

  ###
    Export insure as node module or on window object
  ###
  if module?.exports?
    module.exports = insure
  else
    window.insure ?= insure