/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * ensure.js default assertions
 */
(function() {
    'use strict';

    var ensure;
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        ensure = require('./ensure');
    } else {
        ensure = window.ensure;
    }

    ensure.registerAssertion('number', function(variable) {
        return typeof variable === 'number';
    }).registerAssertion('string', function(variable) {
            return typeof variable === 'string';
    }).registerAssertion('boolean', function(variable) {
        return typeof variable === 'boolean';
    });
}());