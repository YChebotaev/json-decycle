# json-decycle

Stringify and parse cycled reference json by replacing cycled references to [JSON-reference](https://json-spec.readthedocs.io/reference.html)

## Is project alive?

Yes, it works just fine.

Because this library have no dependencies, it's not required to have frequent updates.

If You encounter a bug or need to support special case, feel free to file an issue or open PR.

## Usage

```tsx
import { decycle, retrocycle } from "json-decycle";

var cycled = {
  foo: {},
  bar: {},
};

cycled.foo.bar = cycled.foo;
cycled.bar.foo = cycled.bar;

var result = JSON.stringify(cycled, decycle());
// result === '{"foo":{"bar":{"foo":{"$ref":"#/foo"}}},"bar":{"$ref":"#/foo/bar"}}'

JSON.parse(result, retrocycle());
// => {foo: {{foo: [cyclic reference], bar: [cyclic reference]}}, bar: {{foo: [cyclic reference], bar: [cyclic reference]}}}
```

## Extend JSON global object

`JSON.parse` and `JSON.stringify` is not modified

```tsx
import { extend } from "json-decycle";

JSON.decycle({}) === "{}";
JSON.retrocycle("{}") === {};
```
