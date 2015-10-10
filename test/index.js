var assert = require('assert')

var decycle = require('../index').decycle
var retrocycle = require('../index').retrocycle

var cycled = {
  foo: {},
  bar: {}
}

cycled.foo.bar = cycled.bar
cycled.bar.foo = cycled.foo

assert(cycled.foo.bar === cycled.bar)
assert(cycled.bar.foo === cycled.foo)

var result = JSON.stringify(cycled, decycle())

assert.equal(result, '{"foo":{"bar":{"foo":{"$ref":"#/foo"}}},"bar":{"$ref":"#/foo/bar"}}')

result = JSON.parse(result, retrocycle())

assert(result.foo.bar === result.bar)
assert(result.bar.foo === result.foo)