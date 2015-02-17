var assert = require('chai').assert;

module.exports = function makeMock(object, type) {
  var args = [];
  var mockObj = function mockObj() {};
  var prop;
  for (prop in object.prototype) {
    mockObj.prototype[prop] = mockFunction(prop);
  }

  mockObj.prototype.reset = reset;
  mockObj.prototype.getArgs = getArgs;

  for (prop in object) {
    if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
      mockObj[prop] = mockFunction(prop);
    }
  }

  mockObj.reset = reset;
  mockObj.getArgs = getArgs;

  function reset() {
    for (prop in args) {
      if (args.hasOwnProperty(prop)) {
        args[prop] = [];
      }
    }
  }

  function getArgs() {
    return args;
  }

  return mockObj;

  function mockFunction(name) {
    var returnVal;
    var sideEffects = [];
    args[name] = [];
    function _mockFunction() {
      args[name].push(Array.prototype.slice.call(arguments));
      applySideEffects.apply(this, arguments);
      return returnVal;
    }
    function applySideEffects() {
      for (var i = 0; i < sideEffects.length; i++) {
        sideEffects[i].apply(this, arguments);
      }
    }
    _mockFunction.assertCalledOnceWith = function assertCalledOnceWith(expectedArgs, message) {
      assert.deepEqual(args[name][0], expectedArgs, message);
    };
    _mockFunction.assertCalledOnce = function assertCalledOnce(message) {
      assert.equal(args[name].length, 1, message);
    };
    _mockFunction.assertCalledWith = function assertCalledWith(expectedArgs, message) {
      // TODO: Implement Deep equal comparison
      actualArgs = args[name];
      for (var i = 0; i < actualArgs.length; i++) {
        for (var j = 0; j < actualArgs[i].length; j++) {
          if (expectedArgs[j] !== actualArgs[i][j]) {
            break;
          }
          if (j === actualArgs[i].length - 1) {
            return assert.deepEqual(actualArgs[i], expectedArgs);
          }
        }
      }
      assert.fail(actualArgs, expectedArgs, message);
    };
    _mockFunction.assertNotCalled = function assertNotCalled(message) {
      assert.equal(args[name].length, 0, message);
    };
    _mockFunction.assertNumTimesCalled = function assertNumTimesCalled(num, message) {
      assert.equal(args[name].length, num, message);
    };
    _mockFunction.returns = function returns(value) {
      returnVal = value;
    };
    _mockFunction.assertCalledOnceWithArgsIncluding = function assertCalledWithArgsIncluding(expectedArgs, message) {
      var actualArgs = args[name][0];
      for (var i = 0; i < expectedArgs.length; i++) {
        var matched = false;
        for (var j = 0; j < actualArgs.length; j++) {
          if (deepEqual(actualArgs[j], expectedArgs[i])) {
            matched = true;
            break;
          }
        }
        if (matched === false) {
          return assert.fail(actualArgs, expectedArgs, message);
        }
      }
      return true;
    };
    _mockFunction.addSideEffect = function(sideEffectFunc) {
      sideEffects.push(sideEffectFunc);
    };
    return _mockFunction;
  }
};

