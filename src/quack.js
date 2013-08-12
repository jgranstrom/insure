/**
 * Copyright (c) 2013 John Granström
 * This content is released under the MIT License.
 */
(function() {
  'use strict';

	/**
	 * Determine if quack is globally enabled
	 */
	function isEnabled() {
		if(typeof quackObj.determineEnabled === 'function') return quackObj.determineEnabled();
		return quackObj.enabled;
	}

	/**
	 * For each variable provided, call the callback with the variable as parameter
	 * and expect it to return true for success, if all callback calls return true
	 * this will return true, otherwise false.
	 */
	function each(variables, callback) {
		for(var i = 0; i < variables.length; i++) {
			if(!callback(variables[i])) return false;
		}

		return true;
	}

	/**
	 * Expect truthy argument for successfull assertions, throws for anything else.

	 * @return this
	 */
	function assertion(context, result) {
		if(!result) {
			throw new Error('Quack failed to ensure type');
		}

		return context;
	}

	/**
	 * Test all variables of the QuackObject against a callback,
	 * return result of assertion which is this.
	 * General test method for default assertions
	 * 
	 * Call in context of a quack object
	 */
	function test(context, callback) {
		if(!isEnabled()) return context;

		var result = each(context.variables, callback);
		return assertion(context, result);
	}

	/**
	 * Register a test with test name and assertion callback
	 *
	 * @return quack object
	 */
	function registerTest(name, assertionCallback) {		
		if(typeof assertionCallback !== 'function') {
			throw new Error('Assertion callback must be function');
		}

		if(typeof quackObj[name] === 'undefined') {
			// Add assertion callback on public API
			quackObj[name] = assertionCallback;

			// Add test method to quack prototype, calling test
			// in the context of the current QuackObject
			QuackObject.prototype[name] = function() {
				return test(this, function(variable) {
					return quackObj[name](variable);
				});
			};
		} else {
			throw new Error('Cannot register ' + name + ' as it is already registered.');
		}
	}

	/** 
	 *The global quack object
	 */
	var quackObj = {
		enabled: true,

		/**
		 * Enable quack
		 */
		enable: function() {
			quackObj.enabled = true;
		},

		/**
		 * Disable quack
		 */
		disable: function() {
			quackObj.enabled = false;
		},

		/**
		 * If overridden with a method will be called to determine
		 * if quack is enabled or not. If overriding method returns
		 * true, tests will be run, otherwise all tests will be ignored
		 */
		determineEnabled: undefined,

		/**
		 * Takes a variable number of parameters and creates a 
		 * QuackObject for these to test types upon.
		 */
		ensure: function() {
			return new QuackObject([].slice.call(arguments));
		},

		/**
		 * Contain inverted assertions
		 */
		not: function(assertion) {
			var self = this;
			return test(self, function(variable) {
				return !assertion.call(self, variable);
			});
		},

		/** 
		 * Expose API for registering 3rd party tests
		 */
		registerTest: registerTest
	};

	/**
	 * Instantiated quack object with provided variables
	 */
	function QuackObject(variables) {
		this.variables = variables;
	}

	/**
	 * Quack prototype providing chainable assertion tests
	 */
	QuackObject.prototype = {
		constructor: QuackObject,

		/**
		 * Takes a variable number of parameters and creates a 
		 * QuackObject for these to test types upon.
		 */
		ensure: quackObj.ensure,

		/* For each assertion function provided, test each
		 * variable to succeed for at least one assertions function.
		 *
		 * @return this
		 */
		either: function(/* Assertion functions */) {
			if(!isEnabled()) return this;

			var assertionFuncs = arguments;

			// Specialized test for "either"-behavior
			var testMultipleFunc = function(variable) {
				// Inner test each assertion function
				for(var i = 0; i < assertionFuncs.length; i++) {
					// Accept variable if some assertion func succeeds
					if(assertionFuncs[i](variable)) return true;
				}

				// Reject variable if no assertion func succeeds
				return false;
			};

			// Outer test each variable for each assertion function, accept if some succeeds
			if(each(this.variables, testMultipleFunc)) return this;

			return assertion(this, false);
		},

		/**
		 * Contain inverted assertions
		 */
		not: quackObj.not
	};

	// Register default assertions to quack
	(function() {
		/**
		 * Test an object for being a true array
		 */
		var testTrueArray = (function() {
			if(typeof Array.isArray === 'function') {
				return function(array) {
					return Array.isArray(array);
				};
			} else {
				return function(array) {
					return Object.prototype.toString.call(array) === '[object Array]';
				};
			}
		}());

		registerTest('isNumber', function(variable) {
			return typeof variable === 'number';
		});

		registerTest('isString', function(variable) {
			return typeof variable === 'string';
		});

		registerTest('isBoolean', function(variable) {
			return typeof variable === 'boolean';
		});

		registerTest('isTrueArray', function(variable) {
			return testTrueArray(variable);
		});

		registerTest('isNull', function(variable) {
			return variable === null;
		});

		registerTest('isUndefined', function(variable) {
			return typeof variable === 'undefined';
		});

		registerTest('exists', function(variable) {
			return typeof variable !== 'undefined' && variable !== null;
		});

	}());

	// Export quack as node module, AMD module or on window object
	if(typeof module !== 'undefined' &&  typeof module.exports !== 'undefined') {
		module.exports = exports = quackObj;		
	} else {
		if(typeof define === 'function' && define.amd) {
			define([], function() {
				return quackObj;
			});
		} else {
			window.quack = window.quack || quackObj;
		}
	}
}());
