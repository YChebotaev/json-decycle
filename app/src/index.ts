const _Map = Map
const _WeakMap = WeakMap
const _WeakSet = WeakSet
const _Set = Set

export {
  _Map as Map,
  _WeakMap as WeakMap,
  _WeakSet as WeakSet,
  _Set as Set
}


const isObject = (value: any) => typeof value === 'object'
  && value != null
  && !(value instanceof Boolean)
  && !(value instanceof Date)
  && !(value instanceof Number)
  && !(value instanceof RegExp)
  && !(value instanceof String)


const toPointer = (parts: string[]) => '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')


export function decycle() {
  const paths = new exports.WeakMap()

  return function replacer(key: string | symbol, value: any) {
    if (key !== '$ref' && isObject(value)) {
      const seen = paths.has(value)

      if (seen) {
        return { $ref: toPointer(paths.get(value)) }
      } else {
        paths.set(value, [...paths.get(this) ?? [], key])
      }
    }

    return value
  }
}


export function retrocycle() {
  const parents = new exports.WeakMap()
  const keys = new exports.WeakMap()
  const refs = new exports.Set()

  function dereference(ref: { $ref: string }) {
    const parts = ref.$ref.slice(1).split('/')
    let key, parent, value = this

    for (var i = 0; i < parts.length; i++) {
      key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~')
      value = value[key]
    }

    parent = parents.get(ref)
    parent[keys.get(ref)] = value
  }

  return function reviver(key: string | symbol, value: any) {
    if (key === '$ref') {
      refs.add(this)
    } else
      if (isObject(value)) {
        var isRoot = key === '' && Object.keys(this).length === 1
        if (isRoot) {
          refs.forEach(dereference, this)
        } else {
          parents.set(value, this)
          keys.set(value, key)
        }
      }

    return value
  }
}

export const extend = (_JSON: typeof JSON) => {
  return Object.defineProperties(_JSON, {
    decycle: {
      value: (object: any, space: string | number) => _JSON.stringify(object, decycle(), space)
    },
    retrocycle: {
      value: (s: string) => _JSON.parse(s, retrocycle())
    }
  })
}

