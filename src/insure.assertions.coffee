###
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  insure.js default assertions
###
do ->
  'use strict'

  ###
    Import insure core
  ###
  insure = if module?.exports? then require('./insure') else window.insure

  ###
    Register default assertions
  ###
  insure.registerAssertion 'number', (variable) ->
    typeof variable is 'number'
  .registerAssertion 'string', (variable) ->
    typeof variable is 'string'
  .registerAssertion 'boolean', (variable) ->
    typeof variable is 'boolean'