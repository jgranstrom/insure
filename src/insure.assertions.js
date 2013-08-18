/*
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  insure.js default assertions
*/


(function() {
  (function() {
    'use strict';
    /*
      Import insure core
    */

    var insure;
    insure = (typeof module !== "undefined" && module !== null ? module.exports : void 0) != null ? require('./insure') : window.insure;
    /*
      Register default assertions
    */

    return insure.registerAssertion('number', function(variable) {
      return typeof variable === 'number';
    }).registerAssertion('string', function(variable) {
      return typeof variable === 'string';
    }).registerAssertion('boolean', function(variable) {
      return typeof variable === 'boolean';
    });
  })();

}).call(this);
