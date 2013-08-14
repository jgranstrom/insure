/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * insure.js default assertions
 */
(function() {
    'use strict';

    var insure;
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        insure = require('./insure');
    } else {
        insure = window.insure;
    }

    insure.registerAssertion('number', function(variable) {
        return typeof variable === 'number';
    }).registerAssertion('string', function(variable) {
            return typeof variable === 'string';
    }).registerAssertion('boolean', function(variable) {
        return typeof variable === 'boolean';
    });
}());