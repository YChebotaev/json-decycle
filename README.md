json-decycle (es6)
============

Stringify and parse cycled reference json by replacing cycled references to [JSON-reference](http://json-spec.readthedocs.org/en/latest/reference.html)

Usage
-----

```javascript
var decycle = require('json-decycle').decycle
var retrocycle = require('../index').retrocycle

var cycled = {
  foo: {},
  bar: {}
}

cycled.foo.bar = cycled.foo
cycled.bar.foo = cycled.bar

var result = JSON.stringify(cycled, decycle())
// result === '{"foo":{"bar":{"foo":{"$ref":"#/foo"}}},"bar":{"$ref":"#/foo/bar"}}'

JSON.parse(result, retrocycle())
// => {foo: {{foo: [cyclic reference], bar: [cyclic reference]}}, bar: {{foo: [cyclic reference], bar: [cyclic reference]}}}

```

Extend JSON global object
-------------------------

`JSON.parse` and `JSON.stringify` is not modified

```
require('json-decycle').extend(JSON)

JSON.decycle === require('json-decycle').decycle
JSON.retrocycle === require('json-decycle').retrocycle

```

ES6 features
------------

Library depends on es6 features `WeakMap`, `WeakSet` and `Set` so if you environment does not support this features, you can override it:

```javascript

var jsonDecycle = require('json-decycle')

jsonDecycle.WeakMap = WeakMap
jsonDecycle.WeakSet = WeakSet
jsonDecycle.Set = Set

```