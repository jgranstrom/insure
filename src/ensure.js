/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 *
 * Core ensure.js implementation
 */
(function() {
    'use strict';

    var disabled = false;

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

        return clauseType + '-clause failed to ensure state of variable with index ' + variableIndex +
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
     * Ensure instance
     *
     * @constructor
     * @param {[string]} variables The underlying variables for this EnsureObject
     */
    function EnsureObject(variables) {
        this.variables = variables;
    }

    /**
     * Ensure instance prototype
     */
    EnsureObject.prototype = {
        constructor: EnsureObject,

        /**
         * Make assertions for the variables of this instance
         * All assertions must be satisfied
         *
         * @param {...Assertion} Assertions to make
         * @return Current ensure instance
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
         * @return Current ensure instance
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
     * Global ensure function
     *
     * @param {...object} Variable to make assertions upon
     * @return {EnsureObject | object} New ensure instance
     */
    function ensure(/* Variables */) {
        if(disabled) return mockEnsureObject;

        return new EnsureObject(Array.prototype.slice.call(arguments));
    }

    /* Assertions registered dynamically to ensure object */

    /**
     * Object for inverted assertions
     */
    ensure.not = {
        /* Inverted assertions registered dynamically to ensure.not object */
    };

    /**
     * Register an assertion with name and assertion callback
     * Throws exception if assertion name already exists
     *
     * @param {string} assertionName Name of the assertion to register
     * @param {function} assertionFunc The assertion callback function
     * @return {object} Ensure object for chaining
     */
    ensure.registerAssertion = function (assertionName, assertionFunc) {
        if(disabled) return ensure;

        if(ensure[assertionName]) {
            throw new Error('Cannot register assertion since an assertion with the same name already exists');
        }

        var assertion = new Assertion(assertionName, assertionFunc);

        ensure[assertionName] = assertion;
        ensure.not[assertionName] = new InvertedAssertion(assertion);

        return ensure;
    };

    /**
     * Call to disable all assertions
     * All type-checking will be bypassed silently without breaking implementations
     * Call on initialization phase if in production environment
     */
    ensure.disable = function() {
        disabled = true;
    };

    // Export ensure as node module or on window object
    if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
        module.exports = ensure;

        // Require assertions if node module
        require('./ensure.assertions.js');
    } else {
        window.ensure = window.ensure || ensure;
    }
}());