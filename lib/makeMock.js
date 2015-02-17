var assert = require('chai').assert;
var deepEqual = require('deep-equal');
var makeMockFunction = require('./makeMockFunction');

module.exports = function makeMock(object, type) {

  var args = [];
  var mockObj = function mockObj() {};
  var prop;

  for (prop in object.prototype) {
    mockObj.prototype[prop] = makeMockFunction(args, prop);
  }

  mockObj.prototype.reset = reset;
  mockObj.prototype.getArgs = getArgs;

  for (prop in object) {
    if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
      mockObj[prop] = makeMockFunction(args, prop);
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
};

