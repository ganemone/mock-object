var assert = require('chai').assert;
var deepEqual = require('deep-equal');
var makeMockFunction = require('./makeMockFunction');

module.exports = function makeMock(object, type) {

  var args = [];
  var mockObj = function mockObj() {};
  var prop;

  for (prop in object) {
    console.log('Prop: ', prop);
    var mocked = getMockForProp(prop, object);
    mockObj[prop] = mocked;
  }

  for (prop in object.prototype) {
    mockObj.prototype[prop] = makeMockFunction(args, prop);
  }

  mockObj.prototype.reset = reset;
  mockObj.prototype.getArgs = getArgs;
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

  function getMockForProp(prop, object) {
    // Mock the function
    if (typeof object[prop] === 'function') {
      return makeMockFunction(args, prop);
    }
    // Recursively iterate through object mocking all properties
    else if (typeof object[prop] === 'object') {
      var mockInterface = {};
      for (var propName in object[prop]) {
        mockInterface[propName] = getMockForProp(propName, object[prop]);
      }
      return mockInterface;
    }
    // Return the property if not a function or object
    return object[prop];
  }

  return mockObj;
};

