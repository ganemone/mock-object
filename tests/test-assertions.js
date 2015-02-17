var assert = require('chai').assert;
var makeMock = require('../lib/makeMock');

function API() {
}

API.someFunction = function someFunction() {}
API.prototype.anotherFunction = function() {
};

var mockAPI = makeMock(API);
var newAPI = new mockAPI();

describe('makeMock', function () {
  beforeEach(function () {
    mockAPI.reset();
    newAPI.reset();
  });
  it('should mock object properties correctly', function () {
    assert.equal(typeof mockAPI.someFunction, 'function');
    assert.equal(typeof mockAPI.someFunction.assertCalledOnceWith, 'function');
  });
  it('should mock object prototype correctly', function () {
    assert.equal(typeof newAPI.anotherFunction, 'function');
    assert.equal(typeof newAPI.anotherFunction.assertCalledOnceWith, 'function');
  });
  it('should allow definition of return values', function () {
    mockAPI.someFunction.returns(10);
    assert.equal(mockAPI.someFunction(), 10);
  });
  it('should allow definition of return values on prototype functions', function () {
    newAPI.anotherFunction.returns('some value');
    assert.equal(newAPI.anotherFunction(), 'some value');
  });
});