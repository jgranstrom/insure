/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * Core insure.js implementation
 */
(function() {
    'use strict';

    var disabled = false;

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
    };

    /**
     * Generate an error string for an assertion failure
     *
     * @param {string} clauseType The clause where the failure occurred
     * @param {Number} variableIndex The index of a variable which caused the failure
     * @param {Object} variableValue The contents a variable which caused the failure
     * @param {Assertion | Array} assertion The assertion or array of assertions that failed
     */
    function generateAssertionError(clauseType, variableIndex, variableValue, assertion) {
        var isAssertion = assertion instanceof Assertion;
        var isAssertionArray = Boolean(assertion && assertion.length && assertion[0] instanceof Assertion);
        if(isAssertionArray && assertion.length === 1) {
            assertion = assertion[0];
            isAssertion = true;
            isAssertionArray = false;
        }

        var assertionString = 'no assertions';
        if(isAssertion) {
            assertionString = 'assertion "' + assertion.displayName + '"';
        } else if(isAssertionArray) {
            assertionString = 'assertions\n';
            for(var i = 0; i < assertion.length; i++) {
                assertionString += '\t"' + assertion[i].displayName + '"\n';
            }
        }

        return clauseType + '-clause failed to insure state of variable with index ' + variableIndex +
            ' [value: ' + variableValue + '] for ' + assertionString.trim();
    }

    /**
     * Throw an error for an assertion failure
     *
     * @param {string} clauseType The clause where the failure occurred
     * @param {Number} variableIndex The index of a variable which caused the failure
     * @param {Object} variableValue The contents a variable which caused the failure
     * @param {Assertion | Array} assertion The assertion or array of assertions that failed
     */
    function throwAssertionError(clauseType, variableIndex, variableValue, assertion) {
        throw new Error(generateAssertionError.apply(null, arguments));
    }

    /**
     * Minimal shim for Object.create, will use native Object.create if available
     *
     * @param prototypeObject The prototype on which to create a new object
     * @returns {Object} An object with the provided prototypeObject as prototype
     */
    function createObject(prototypeObject) {
        if(typeof Object.create ===  'function') return Object.create.apply(null, arguments);

        function F() {}
        F.prototype = prototypeObject;
        return new F();
    }

    /**
     * Assertion instance
     *
     * @constructor
     * @param {string} name The name of this assertion
     * @param {function} assertionFunc The assertion callback function
     * @param {string} [displayName] Optional display name if different from name
     */
    function Assertion(name, assertionFunc, displayName) {
        this.name = name;
        this.displayName = displayName || name;
        this.assert = assertionFunc;
    }

    /**
     * Inverted assertion instance which inherits from Assertion
     * Creates an assertion with inverted assertion logic based on another assertion instance
     *
     * @constructor
     * @param {Assertion} baseAssertion Base assertion to make inversion for
     */
    function InvertedAssertion(baseAssertion) {
        Assertion.call(this, baseAssertion.name, function() {
            return !baseAssertion.assert.apply(null, arguments);
        }, 'not ' + baseAssertion.name);
    }
    InvertedAssertion.prototype = createObject(Assertion.prototype);
    InvertedAssertion.prototype.constructor = InvertedAssertion;

    /**
     * Insure instance
     *
     * @constructor
     * @param {[string]} variables The underlying variables for this InsureObject
     */
    function InsureObject(variables) {
        this.variables = variables;
    }

    /**
     * Insure instance prototype
     */
    InsureObject.prototype = {
        constructor: InsureObject,

        /**
         * Make assertions for the variables of this instance
         * All assertions must be satisfied
         *
         * @param {...Assertion} Assertions to make
         * @return Current insure instance
         */
        must: function(/* Assertion instances */) {
            if(disabled) return this;

            for(var j = 0; j < this.variables.length; j++) {
                for(var i = 0; i < arguments.length; i++) {
                    if(!arguments[i].assert(this.variables[j])) {
                        throwAssertionError('must', j, this.variables[j], arguments[i]);
                    }
                }
            }

            return this;
        },

        /**
         * Make assertions for the variables of this instance
         * At least one assertion must be satisfied per variable
         *
         * @param {...Assertion} Assertions to make
         * @return Current insure instance
         */
        either: function(/* Assertion instances */) {
            if(disabled) return this;

            for(var j = 0; j < this.variables.length; j++) {
                var succeeded = false;
                for(var i = 0; i < arguments.length; i++) {
                    if((succeeded = arguments[i].assert(this.variables[j]))) break;
                }

                if(!succeeded) {
                    throwAssertionError('either', j, this.variables[j], arguments);
                }
            }

            return this;
        }
    };

    /**
     * Global insure function
     *
     * @param {...object} Variable to make assertions upon
     * @return {InsureObject | object} New insure instance
     */
    function insure(/* Variables */) {
        if(disabled) return mockInsureObject;

        return new InsureObject(Array.prototype.slice.call(arguments));
    }

    /* Assertions registered dynamically to insure object */

    /**
     * Object for inverted assertions
     */
    insure.not = {
        /* Inverted assertions registered dynamically to insure.not object */
    };

    /**
     * Register an assertion with name and assertion callback
     * Throws exception if assertion name already exists
     *
     * @param {string} assertionName Name of the assertion to register
     * @param {function} assertionFunc The assertion callback function
     * @return {object} Insure object for chaining
     */
    insure.registerAssertion = function (assertionName, assertionFunc) {
        if(disabled) return insure;

        if(insure[assertionName]) {
            throw new Error('Cannot register assertion since an assertion with the same name already exists');
        }

        var assertion = new Assertion(assertionName, assertionFunc);

        insure[assertionName] = assertion;
        insure.not[assertionName] = new InvertedAssertion(assertion);

        return insure;
    };

    /**
     * Call to disable all assertions
     * All type-checking will be bypassed silently without breaking implementations
     * Call on initialization phase if in production environment
     */
    insure.disable = function() {
        disabled = true;
    };

    // Export insure as node module or on window object
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        module.exports = insure;

        // Require assertions if node module
        require('./insure.assertions.js');
    } else {
        window.insure = window.insure || insure;
    }
}());
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