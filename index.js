exports.WeakMap = WeakMap
exports.WeakSet = WeakSet
exports.Set = Set

function isObject (value) {
  return typeof value === 'object' && value != null &&
    !(value instanceof Boolean) &&
    !(value instanceof Date) &&
    !(value instanceof Number) &&
    !(value instanceof RegExp) &&
    !(value instanceof String)
}

function decycle (object) {
  var seen = new exports.WeakSet()
  var paths = new exports.WeakMap()
  
  return function replacer (key, value) {
    if (key !== '$ref' && isObject(value)) {
      if (seen.has(value)) {
        return {$ref: toPointer(paths.get(value))}
      } else {
        paths.set(value, (paths.get(this)||[]).concat([key]))
        seen.add(value)
      }
    }

    return value
  }

  function toPointer (parts) {
    return '#'+parts.map(function(part) {
      return part.toString().replace(/~/g, '~0').replace(/\//g, '~1')
    }).join('/')
  }
}

function retrocycle () {
  var parents = new exports.WeakMap()
  var refs = new exports.Set()

  return function reviver (key, value) {
    if (key === '$ref') {
      refs.add(this)
    } else
    if (isObject(value)) {
      var isRoot = key === '' && Object.keys(this).length === 1
      if (isRoot) {
        refs.forEach(dereference, this)
      } else {
        parents.set(value, this)
      }
    }

    return value
  }

  function dereference (ref) {
    var parts = ref.$ref.slice(1).split('/')
    var key, parent, value = this
    for (var i=0; i<parts.length; i++) {
      key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~')
      value = value[key]
    }
    parent = parents.get(ref)
    parent[key] = value
  }

}

function augment (JSON) {
  return Object.defineProperties(JSON, {
    decycle: {value: decycle},
    retrocycle: {value: retrocycle}
  })
}

exports.decycle = decycle
exports.retrocycle = retrocycle
exports.extend = augment