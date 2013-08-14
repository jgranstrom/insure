/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * Mock production ensure.js shell implementation
 */
(function() {
    'use strict';

    /**
     * Mock ensure instance object with mock API
     */
    var mockEnsureObject = {
        must: function() {
            return mockEnsureObject;
        },

        either: function() {
            return mockEnsureObject;
        }
    };

    /**
     * Mock global ensure object
     */
    function ensure() {
        return mockEnsureObject;
    }

    /**
     * Mock not-object
     */
    ensure.not = {};

    /**
     * Mock register function
     */
    ensure.registerAssertion = function () {
        return ensure;
    };

    /**
     * Mock disable function
     * Production shell disabled by default
     */
    ensure.disable = function() {};

    // Export ensure as node module or on window object
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        module.exports = exports = ensure;
    } else {
        window.ensure = window.ensure || ensure;
    }
}());