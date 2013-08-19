/*
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  Mock production insure.js shell implementation
*/


(function() {
  (function() {
    'use strict';
    /*
      Mock insure instance object with mock API
    */

    var insure, mockInsureObject;
    mockInsureObject = {
      must: function() {
        return mockInsureObject;
      },
      either: function() {
        return mockInsureObject;
      }
    };
    /*
      Mock global insure object
    */

    insure = function() {
      return mockInsureObject;
    };
    /*
      Mock not-object
    */

    insure.not = {};
    /*
      Mock register function
    */

    insure.registerAssertion = function() {
      return insure;
    };
    /*
      Mock disable function
      Production shell disabled by default
    */

    insure.disable = function() {};
    /*
      Export insure as node module or on window object
    */

    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
      return module.exports = insure;
    } else {
      return window.insure != null ? window.insure : window.insure = insure;
    }
  })();

}).call(this);
