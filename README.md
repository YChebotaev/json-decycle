json-decycle (es6)
============

Stringify and parse cycled reference json by replacing cycled references to [JSON-reference](https://json-spec.readthedocs.io/reference.html)

Is project alive?
----------------

Yes, it works just fine.

Because this library have no dependencies, it's not required to have frequent updates.

If You encounter a bug or need to support special case, feel free to file an issue or open PR.

Usage
-----

```javascript
var decycle = require('json-decycle').decycle
var retrocycle = require('json-decycle').retrocycle

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

```javascript
require('json-decycle').extend(JSON)

JSON.decycle({}) === '{}'
JSON.retrocycle('{}') === {}
```

ES6 features
------------

Library depends on es6 features `Map`, `WeakMap`, `WeakSet` and `Set` so if you environment does not support this features, you can override it:

```javascript
const jsonDecycle = require('json-decycle')

jsonDecycle.Map = Map
jsonDecycle.WeakMap = WeakMap
jsonDecycle.WeakSet = WeakSet
jsonDecycle.Set = Set
```
