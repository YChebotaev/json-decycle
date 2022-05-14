exports.Map = Map
exports.WeakMap = WeakMap
exports.WeakSet = WeakSet
exports.Set = Set

/**
 * @param {any} value 
 */
const isObject = (value) => typeof value === 'object'
  && value != null
  && !(value instanceof Boolean)
  && !(value instanceof Date)
  && !(value instanceof Number)
  && !(value instanceof RegExp)
  && !(value instanceof String)

/**
 * @param {string[]} parts 
 */
const toPointer = (parts) => '#' + parts.map(part => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/')

const sym = Symbol('$ref')

/**
 * @returns (key: string | symbol, value: any) => any
 */
const decycle = () => {
  const paths = new exports.WeakMap()

  /**
   * @param {string | symbol} key
   * @param {any} value
   * @this object
   */
  return function replacer(key, value) {
    if (key === '$ref' && (typeof value === "string" || (value instanceof String && !value[sym])) && value.startsWith("#")) return "#" + value
    if (isObject(value)) {
      const seen = paths.has(value)

      if (seen) {
        const $ref = new String(toPointer(paths.get(value)))
        $ref[sym] = true
        return { $ref }
      } else {
        paths.set(value, [...paths.get(this) ?? [], key])
      }
    }

    return value
  }
}

/**
 * @returns (key: string | symbol, value: any) => any
 */
function retrocycle() {
  const parents = new exports.WeakMap()
  const keys = new exports.WeakMap()
  const refs = new exports.Set()

  /**
   * @param {{ $ref: string }} ref
   * @this object
   */
  function dereference(ref) {
    const parts = ref.$ref.slice(1).split('/')
    let key, parent, value = this

    for (var i = 0; i < parts.length; i++) {
      key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~')
      value = value[key]
    }

    parent = parents.get(ref)
    parent[keys.get(ref)] = value
  }

  /**
   * @param {string | symbol} key
   * @param {any} value
   * @this object
   */
  return function reviver(key, value) {
    if (key === '$ref' && typeof value === "string") {
      if (value.startsWith("##")) return value.slice(1)
      else if (value.startsWith("#/")) {
        refs.add(this)
        return value
      }
    } 
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

/**
 * @param {{ parse: typeof JSON.parse, stringify: typeof JSON.stringify }} JSON
 */
const extend = (JSON) => {
  return Object.defineProperties(JSON, {
    decycle: {
      /**
       * @param {any} object
       * @param {string | number} space
       * @returns string
       */
      value: (object, space) => JSON.stringify(object, decycle(), space)
    },
    retrocycle: {
      /**
       * @param {string} s 
       * @returns any
       */
      value: (s) => JSON.parse(s, retrocycle())
    }
  })
}

Object.assign(exports, {
  decycle,
  retrocycle,
  extend
})
