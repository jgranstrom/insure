<<<<<<< HEAD
/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * Mock production insure.js shell implementation
 */
=======
/*
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  Mock production insure.js shell implementation
*/


>>>>>>> origin/coffescript-refactor
(function() {
  (function() {
    'use strict';
    /*
      Mock insure instance object with mock API
    */

<<<<<<< HEAD
    /**
     * Mock insure instance object with mock API
     */
    var mockInsureObject = {
        must: function() {
            return mockInsureObject;
        },

        either: function() {
            return mockInsureObject;
        }
=======
    var insure, mockInsureObject;
    mockInsureObject = {
      must: function() {
        return mockInsureObject;
      },
      either: function() {
        return mockInsureObject;
      }
>>>>>>> origin/coffescript-refactor
    };
    /*
      Mock global insure object
    */

<<<<<<< HEAD
    /**
     * Mock global insure object
     */
    function insure() {
        return mockInsureObject;
    }

    /**
     * Mock not-object
     */
    insure.not = {};

    /**
     * Mock register function
     */
    insure.registerAssertion = function () {
        return insure;
=======
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
>>>>>>> origin/coffescript-refactor
    };
    /*
      Mock disable function
      Production shell disabled by default
    */

<<<<<<< HEAD
    /**
     * Mock disable function
     * Production shell disabled by default
     */
    insure.disable = function() {};

    // Export insure as node module or on window object
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        module.exports = exports = insure;
    } else {
        window.insure = window.insure || insure;
=======
    insure.disable = function() {};
    /*
      Export insure as node module or on window object
    */

    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
      return module.exports = insure;
    } else {
      return window.insure != null ? window.insure : window.insure = insure;
>>>>>>> origin/coffescript-refactor
    }
  })();

}).call(this);
