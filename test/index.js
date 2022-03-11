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

var obj1 = {}
var obj2 = { b: obj1 }
obj1.a = obj2
obj2.c = obj1.a
obj2.d = obj1.a

assert(obj1 === obj2.b)
assert(obj1 === obj1.a.b)
assert(obj1.a === obj1.a.c)
assert(obj1.a === obj1.a.d)

var result2 = JSON.stringify(obj1, decycle())

assert.equal(result2, '{"a":{"b":{"$ref":"#"},"c":{"$ref":"#/a"},"d":{"$ref":"#/a"}}}')

result2 = JSON.parse(result2, retrocycle())

assert(result2 === result2.a.b)
assert(result2.a === result2.a.c)
assert(result2.a === result2.a.d)

var cycled2 = {
  foo: {},
  bar: {}
}

cycled2.foo.bar = cycled2.foo
cycled2.bar.foo = cycled2.bar

assert(cycled2.foo.bar === cycled2.foo)
assert(cycled2.bar.foo === cycled2.bar)

var result3 = JSON.stringify(cycled2, decycle())

assert.equal(result3, '{"foo":{"bar":{"$ref":"#/foo"}},"bar":{"foo":{"$ref":"#/bar"}}}')

result3 = JSON.parse(result3, retrocycle())

assert(result3.foo.bar === result3.foo)
assert(result3.bar.foo === result3.bar)

console.log('Done! All tests have been passed!')
