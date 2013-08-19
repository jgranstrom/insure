/*
  Copyright (c) 2013 John Granström
  This content is released under the MIT License.

  Core insure.js implementation
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function() {
    'use strict';
    var Assertion, InsureObject, InvertedAssertion, disabled, generateAssertionError, insure, mockInsureObject, throwAssertionError;
    disabled = false;
    /*
      Mock insure instance object with mock API
    */

    mockInsureObject = {
      must: function() {
        return mockInsureObject;
      },
      either: function() {
        return mockInsureObject;
      }
    };
    /*
      Generate an error string for an assertion failure
    
      @param {string} clauseType The clause where the failure occurred
      @param {Number} variableIndex The index of a variable which caused
                      the failure
      @param {Object} variableValue The contents a variable which caused
                      the failure
      @param {Assertion | Array} assertion The assertion or array of
                      assertions that failed
    */

    generateAssertionError = function(clauseType, variableIndex, variableValue, asser) {
      var a, assertionMode, assertionString, _i, _len;
      assertionMode = 0;
      if (asser instanceof Assertion) {
        assertionMode = 1;
      }
      if ((asser.length != null) && asser[0] instanceof Assertion) {
        assertionMode = 2;
      }
      if (assertionMode === 2 && asser.length === 1) {
        asser = asser[0];
        assertionMode = 1;
      }
      if (assertionMode < 2) {
        assertionString = assertionMode === 0 ? "no assertions" : "assertion \"" + asser.displayName + "\"";
      } else {
        assertionString = "assertions\n:";
        for (_i = 0, _len = asser.length; _i < _len; _i++) {
          a = asser[_i];
          assertionString += "\t" + a.displayName + "\n";
        }
      }
      return "" + clauseType + "-clause failed to insure state of variable with index     " + variableIndex + " [value: " + variableValue + "] for " + (assertionString.trim());
    };
    /*
      Throw an error for an assertion failure
    
      @param {string} clauseType The clause where the failure occurred
      @param {Number} variableIndex The index of a variable which
                      caused the failure
      @param {Object} variableValue The contents a variable which
                      caused the failure
      @param {Assertion | Array} assertion The assertion or array of
                      assertions that failed
    */

    throwAssertionError = function() {
      throw generateAssertionError.apply(null, arguments);
    };
    /*
      Assertion instance
    
      @constructor
      @param {string} name The name of this assertion
      @param {function} assertionFunc The assertion callback function
      @param {string} [displayName] Optional display name if different from name
    */

    Assertion = (function() {
      function Assertion(name, assertionFunc, displayName) {
        this.name = name;
        this.assertionFunc = assertionFunc;
        this.assert = __bind(this.assert, this);
        this.displayName = displayName || name;
      }

      Assertion.prototype.assert = function() {
        return this.assertionFunc.apply(this, arguments);
      };

      return Assertion;

    })();
    /*
      Inverted assertion instance which inherits from Assertion
      Creates an assertion with inverted assertion logic based
      on another assertion instance
    
      @constructor
      @param {Assertion} baseAssertion Base assertion to make inversion fo
    */

    InvertedAssertion = (function(_super) {
      __extends(InvertedAssertion, _super);

      function InvertedAssertion(baseAssertion) {
        this.assert = __bind(this.assert, this);
        InvertedAssertion.__super__.constructor.call(this, baseAssertion.name, baseAssertion.assertionFunc, "not " + baseAssertion.displayName);
      }

      InvertedAssertion.prototype.assert = function() {
        return !InvertedAssertion.__super__.assert.apply(this, arguments);
      };

      return InvertedAssertion;

    })(Assertion);
    /*
      Insure instance
    
      @constructor
      @param {[string]} variables The underlying variables for this InsureObject
    */

    InsureObject = (function() {
      function InsureObject(variables) {
        this.variables = variables;
        this.either = __bind(this.either, this);
        this.must = __bind(this.must, this);
      }

      /*
        Make assertions for the variables of this instance
        All assertions must be satisfied
      
        @param {...Assertion} Assertions to make
        @return Current insure instance
      */


      InsureObject.prototype.must = function() {
        var assertion, i, variable, _i, _j, _len, _len1, _ref;
        if (disabled) {
          return this;
        }
        _ref = this.variables;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          variable = _ref[i];
          for (_j = 0, _len1 = arguments.length; _j < _len1; _j++) {
            assertion = arguments[_j];
            if (!assertion.assert(variable)) {
              throwAssertionError("must", i, variable, assertion);
            }
          }
        }
        return this;
      };

      /*
        Make assertions for the variables of this instance
        At least one assertion must be satisfied per variable
      
        @param {...Assertion} Assertions to make
        @return Current insure instance
      */


      InsureObject.prototype.either = function() {
        var assertion, i, variable, _i, _len, _ref;
        if (disabled) {
          return this;
        }
        _ref = this.variables;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          variable = _ref[i];
          if (__indexOf.call((function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = arguments.length; _j < _len1; _j++) {
              assertion = arguments[_j];
              _results.push(assertion.assert(variable));
            }
            return _results;
          }).apply(this, arguments), true) < 0) {
            throwAssertionError('either', i, variable, arguments);
          }
        }
        return this;
      };

      return InsureObject;

    })();
    /*
      Global insure function
    
      @param {...object} Variable to make assertions upon
      @return {InsureObject | object} New insure instance
    */

    insure = function() {
      if (disabled) {
        return mockInsureObject;
      }
      return new InsureObject(arguments);
    };
    insure.not = {};
    /*
      Register an assertion with name and assertion callback
      Throws exception if assertion name already exists
    
      @param {string} assertionName Name of the assertion to register
      @param {function} assertionFunc The assertion callback function
      @return {object} Insure object for chaining
    */

    insure.registerAssertion = function(assertionName, assertionFunc) {
      var assertion;
      if (disabled) {
        return insure;
      }
      if (insure[assertionName] != null) {
        throw new Error("Cannot register assertion since an assertion \      with the same name already exists");
      }
      assertion = new Assertion(assertionName, assertionFunc);
      insure[assertionName] = assertion;
      insure.not[assertionName] = new InvertedAssertion(assertion);
      return insure;
    };
    /*
      Call to disable all assertions
      All type-checking will be bypassed silently without breaking
      implementations, call on initialization phase if in production environment
    */

    insure.disable = function() {
      return disabled = true;
    };
    /*
      Export insure as node module or on window object
    */

    if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
      module.exports = insure;
      /*
        Require assertions if node module
      */

      return require('./insure.assertions.js');
    } else {
      return window.insure != null ? window.insure : window.insure = insure;
    }
  })();

}).call(this);

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
